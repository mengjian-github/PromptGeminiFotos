import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserSubscriptionData } from '@/lib/subscription';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const subscriptionData = await getUserSubscriptionData(session.user.id);

    return NextResponse.json({
      success: true,
      data: subscriptionData,
    });

  } catch (error) {
    console.error('[user/subscription] Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
}