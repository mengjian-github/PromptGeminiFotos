import { NextRequest, NextResponse } from 'next/server';
import { generateImage, GenerateImageParams } from '@/lib/openrouter';
import { supabaseHelpers, getSupabaseAdmin } from '@/lib/supabase';
import { getUserSubscriptionData, incrementUserGenerations } from '@/lib/subscription';
import { uploadImageFromUrl } from '@/lib/r2';
import { config } from '@/lib/config';
import { headers } from 'next/headers';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip') || 'unknown';
  return `rate_limit:${ip}`;
}

function checkRateLimit(key: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey, 5, 60000)) { // 5 requests per minute
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      prompt,
      imageUrl,
      userId,
      category = 'portrait',
      style = 'natural',
      resolution = '512x512'
    } = body as GenerateImageParams & { userId?: string };

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check user generation limits if userId provided
    if (userId) {
      const userData = await getUserSubscriptionData(userId);

      // Check if user has reached their limit
      if (userData.subscriptionStatus === 'free' && userData.generationsUsed >= userData.generationsLimit) {
        return NextResponse.json({
          error: 'Generation limit reached',
          message: 'You have reached your free generation limit. Please upgrade to Pro for unlimited generations.',
          remaining: 0,
          needsUpgrade: true
        }, { status: 403 });
      }

      // For free users, enforce lower resolution
      if (userData.subscriptionStatus === 'free') {
        if (resolution === '1024x1024') {
          return NextResponse.json({
            error: 'High resolution requires Pro subscription',
            message: 'Upgrade to Pro for high-resolution (1024x1024) image generation.',
            needsUpgrade: true
          }, { status: 403 });
        }
      }
    } else {
      // Anonymous user - only allow basic resolution
      if (resolution === '1024x1024') {
        return NextResponse.json({
          error: 'High resolution requires account and Pro subscription',
          message: 'Please sign up for free generations or upgrade to Pro for high-resolution images.',
          needsUpgrade: true
        }, { status: 403 });
      }
    }

    // Generate image using OpenRouter
    const generateParams: GenerateImageParams = {
      prompt,
      imageUrl,
      userId,
      category,
      style,
      resolution: userId ? resolution : '512x512' // Force low-res for anonymous users
    };

    const result = await generateImage(generateParams);

    if (!result.success) {
      console.error('Image generation failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to generate image' },
        { status: 500 }
      );
    }

    // If user is logged in, save generation record and increment count
    let generationId: string | null = null;
    let remaining = 0;
    // Ensure we always persist a string for generated_image_url
    let finalImageUrl: string = result.imageUrl || '';

    if (userId && result.imageUrl) {
      // Upload generated image to R2 for permanent storage
      const r2UploadResult = await uploadImageFromUrl(result.imageUrl, userId, 'generated');

      if (r2UploadResult.success && r2UploadResult.url) {
        finalImageUrl = r2UploadResult.url;
      } else {
        console.error('Failed to upload to R2, using original URL:', r2UploadResult.error);
        // Continue with original URL if R2 upload fails
      }

      // Upload original image to R2 if provided
      let finalOriginalUrl = imageUrl;
      if (imageUrl) {
        const originalR2Result = await uploadImageFromUrl(imageUrl, userId, 'original');
        if (originalR2Result.success && originalR2Result.url) {
          finalOriginalUrl = originalR2Result.url;
        }
      }

      // Increment user generation count
      const { success: incrementSuccess, newCount } = await incrementUserGenerations(userId);

      if (!incrementSuccess) {
        console.error('Failed to increment generation count for user:', userId);
      }

      // Save generation record
      generationId = await supabaseHelpers.saveGeneration({
        user_id: userId,
        original_image_url: finalOriginalUrl || null,
        generated_image_url: finalImageUrl,
        prompt_text: result.prompt || prompt,
        category,
        style,
        resolution,
        is_public: false // Default to private
      });

      // Calculate remaining generations
      const userData = await getUserSubscriptionData(userId);
      remaining = userData.subscriptionStatus === 'pro' ? -1 : Math.max(0, userData.generationsLimit - newCount);
    }

    return NextResponse.json({
      success: true,
      imageUrl: finalImageUrl,
      prompt: result.prompt,
      generationId,
      usage: result.usage,
      remaining: remaining === -1 ? 'unlimited' : remaining,
      resolution,
      watermark: resolution === '512x512' && remaining !== -1 // Add watermark for free users
    });

  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': config.app.url,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
