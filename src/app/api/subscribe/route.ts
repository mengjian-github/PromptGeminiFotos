import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { subscriptionHelpers } from '@/lib/creem';

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { planType = 'monthly' } = body;

    // Validate plan type
    if (!['monthly', 'yearly'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Create checkout session
    const checkoutSession = await subscriptionHelpers.createProSubscription(
      session.user.id,
      session.user.email || '',
      session.user.name || '',
      planType
    );

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.checkoutUrl,
      sessionId: checkoutSession.sessionId,
    });

  } catch (error) {
    console.error('Subscription creation error:', error);

    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}