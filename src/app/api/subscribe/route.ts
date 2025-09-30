import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { subscriptionHelpers } from '@/lib/creem';

export async function POST(request: NextRequest) {
  try {
    console.log('[subscribe] Creating new subscription...');

    // Verify user authentication
    const session = await auth();

    if (!session?.user?.id) {
      console.log('[subscribe] Authentication failed - no user session');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('[subscribe] User authenticated:', {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    });

    // Check if user exists in database, if not create it
    const { getSupabaseAdmin } = await import('@/lib/supabase');
    const supabase = getSupabaseAdmin();
    const { data: userData, error: userCheckError } = await (supabase as any)
      .from('users')
      .select('id, email, subscription_status')
      .eq('id', session.user.id)
      .single();

    console.log('[subscribe] User check result:', {
      found: !!userData,
      userData,
      error: userCheckError
    });

    

    // Parse request body
    const body = await request.json();
    const { planType = 'monthly' } = body;

    console.log('[subscribe] Plan type:', planType);

    // Validate plan type
    if (!['monthly', 'yearly'].includes(planType)) {
      console.log('[subscribe] Invalid plan type:', planType);
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Create checkout session
    console.log('[subscribe] Creating Creem checkout session...');
    const checkoutSession = await subscriptionHelpers.createProSubscription(
      session.user.id,
      session.user.email || '',
      session.user.name || '',
      planType
    );

    console.log('[subscribe] Checkout session created:', checkoutSession);

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.checkoutUrl,
      sessionId: checkoutSession.sessionId,
    });

  } catch (error) {
    console.error('[subscribe] Subscription creation error:', error);

    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}