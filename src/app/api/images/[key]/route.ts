import { NextRequest, NextResponse } from 'next/server';
import { deleteFromR2, generateDownloadPresignedUrl } from '@/lib/r2';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

type RouteContext = {
  params: Promise<{ key: string }>;
};

// Get image download URL
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { key } = await context.params;

    if (!key) {
      return NextResponse.json(
        { error: 'Image key is required' },
        { status: 400 }
      );
    }

    // Generate presigned URL for secure access
    const downloadUrl = await generateDownloadPresignedUrl(decodeURIComponent(key), 3600);

    return NextResponse.json({
      success: true,
      downloadUrl,
      expiresIn: 3600
    });

  } catch (error) {
    console.error('Image access error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}

// Delete image (user must own the image)
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

    const { key } = await context.params;

    if (!key) {
      return NextResponse.json(
        { error: 'Image key is required' },
        { status: 400 }
      );
    }

    const decodedKey = decodeURIComponent(key);

    // Check if the image belongs to the user
    const supabase = getSupabaseAdmin();
    const { data: generation, error } = await supabase
      .from('generations')
      .select('id, user_id')
      .or(`generated_image_url.ilike.%${decodedKey}%,original_image_url.ilike.%${decodedKey}%`)
      .eq('user_id', session.user.id)
      .single();

    if (error || !generation) {
      return NextResponse.json(
        { error: 'Image not found or access denied' },
        { status: 404 }
      );
    }

    // Delete from R2
    const deleteSuccess = await deleteFromR2(decodedKey);

    if (!deleteSuccess) {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Image deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}