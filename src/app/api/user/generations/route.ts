import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get user's generations
    const { data: generations, error } = await supabase
      .from('generations')
      .select(`
        id,
        generated_image_url,
        prompt_text,
        category,
        style,
        resolution,
        created_at,
        is_public
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user generations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch generations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      generations: generations || [],
    });

  } catch (error) {
    console.error('Get user generations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
