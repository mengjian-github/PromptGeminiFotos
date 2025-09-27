import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { creem, subscriptionHelpers } from '@/lib/creem';
import { config as appConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('x-creem-signature');

    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValidSignature = creem.verifyWebhookSignature(
      body,
      signature,
      appConfig.creem.webhookSecret
    );

    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the event
    const event = JSON.parse(body);

    // Handle different event types
    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionUpdate(event);
        break;

      case 'subscription.deleted':
      case 'subscription.canceled':
        await handleSubscriptionCancellation(event);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailure(event);
        break;

      default:
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdate(event: any) {
  try {
    const subscription = event.data.object;
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('Missing userId in subscription metadata');
      return;
    }

    await subscriptionHelpers.handleSubscriptionSuccess(
      subscription.id,
      userId
    );

  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionCancellation(event: any) {
  try {
    const subscription = event.data.object;

    await subscriptionHelpers.handleSubscriptionCancellation(subscription.id);

  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handlePaymentSuccess(event: any) {
  const subscriptionId = event?.data?.object?.subscription;
  console.info('[creem] payment succeeded for subscription', subscriptionId);
  // Billing sync disabled temporarily; stored for future implementation.
}

async function handlePaymentFailure(event: any) {
  const subscriptionId = event?.data?.object?.subscription;
  console.warn('[creem] payment failed for subscription', subscriptionId);
  // Billing sync disabled temporarily; stored for future implementation.
}

// Disable body parsing for raw webhook payload
export const config = {
  api: {
    bodyParser: false,
  },
};
