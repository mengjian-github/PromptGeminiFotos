import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { deleteFromR2 } from '@/lib/r2';

type GenerationRecord = {
  id: string;
  user_id: string;
  generated_image_url: string | null;
  original_image_url: string | null;
};

type RouteContext = {
  params: Promise<{ generationId: string }>;
};

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { generationId } = await context.params;
    const supabase = getSupabaseAdmin();

    // Get the generation to verify ownership and get image URLs
    const { data: generationData, error: fetchError } = await supabase
      .from('generations')
      .select('id, user_id, generated_image_url, original_image_url')
      .eq('id', generationId)
      .eq('user_id', session.user.id)
      .single();

    const generation = generationData as GenerationRecord | null;

    if (fetchError || !generation) {
      return NextResponse.json(
        { error: 'Generation not found or access denied' },
        { status: 404 }
      );
    }

    // Delete related records first (due to foreign key constraints)
    // Removed unused relations (likes/views) per cleanup

    // Delete the generation record
    const { error: deleteError } = await supabase
      .from('generations')
      .delete()
      .eq('id', generationId);

    if (deleteError) {
      console.error('Error deleting generation:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete generation' },
        { status: 500 }
      );
    }

    // Clean up images from R2 (extract keys from URLs)
    const cleanupPromises: Promise<unknown>[] = [];

    if (generation.generated_image_url) {
      const generatedKey = extractR2KeyFromUrl(generation.generated_image_url);
      if (generatedKey) {
        cleanupPromises.push(deleteFromR2(generatedKey));
      }
    }

    if (generation.original_image_url) {
      const originalKey = extractR2KeyFromUrl(generation.original_image_url);
      if (originalKey) {
        cleanupPromises.push(deleteFromR2(originalKey));
      }
    }

    // Execute cleanup (don't wait for it, and don't fail if it errors)
    Promise.all(cleanupPromises).catch(error => {
      console.error('Error cleaning up R2 images:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Generation deleted successfully'
    });

  } catch (error) {
    console.error('Delete generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to extract R2 key from URL
function extractR2KeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Remove leading slash and return the key
    return pathname.startsWith('/') ? pathname.substring(1) : pathname;
  } catch (error) {
    console.error('Error extracting R2 key from URL:', url, error);
    return null;
  }
}
