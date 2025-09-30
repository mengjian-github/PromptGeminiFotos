import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { creem, subscriptionHelpers } from '@/lib/creem';
import { config as appConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('creem-signature');

    console.log('[webhook] Received webhook request');
    console.log('[webhook] Headers:', Object.fromEntries(headersList.entries()));

    if (!signature) {
      console.error('[webhook] Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    console.log('[webhook] Signature present:', signature.substring(0, 20) + '...');

    // Verify webhook signature
    const isValidSignature = creem.verifyWebhookSignature(
      body,
      signature,
      appConfig.creem.webhookSecret
    );

    if (!isValidSignature) {
      console.error('[webhook] Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    console.log('[webhook] Signature verified successfully');

    // Parse the event
    const event = JSON.parse(body);
    const eventType = event.eventType; // Creem uses 'eventType' not 'type'
    console.log('[webhook] Event type:', eventType);
    console.log('[webhook] Event ID:', event.id);

    // Handle different event types
    switch (eventType) {
      case 'subscription.active':
      case 'subscription.paid':
        console.log('[webhook] Handling subscription activation...');
        await handleSubscriptionUpdate(event);
        break;

      case 'subscription.canceled':
      case 'subscription.expired':
        console.log('[webhook] Handling subscription cancellation...');
        await handleSubscriptionCancellation(event);
        break;

      case 'checkout.completed':
        console.log('[webhook] Handling checkout completion...');
        await handleCheckoutCompleted(event);
        break;

      default:
        console.log('[webhook] Unhandled event type:', eventType);
    }

    console.log('[webhook] Webhook processed successfully');
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
    const subscription = event.object; // Creem structure
    const userId = subscription.metadata?.userId;

    console.log('[webhook] Subscription data:', {
      id: subscription.id,
      status: subscription.status,
      userId,
      customer: subscription.customer?.email,
    });

    if (!userId) {
      console.error('[webhook] Missing userId in subscription metadata');
      return;
    }

    await subscriptionHelpers.handleSubscriptionSuccess(
      subscription,
      userId
    );

    console.log('[webhook] Subscription update handled successfully');
  } catch (error) {
    console.error('[webhook] Error handling subscription update:', error);
  }
}

async function handleSubscriptionCancellation(event: any) {
  try {
    const subscription = event.object; // Creem structure

    console.log('[webhook] Cancellation data:', {
      id: subscription.id,
      status: subscription.status,
    });

    await subscriptionHelpers.handleSubscriptionCancellation(subscription.id);

    console.log('[webhook] Subscription cancellation handled successfully');
  } catch (error) {
    console.error('[webhook] Error handling subscription cancellation:', error);
  }
}

async function handleCheckoutCompleted(event: any) {
  try {
    const checkout = event.object; // Creem structure
    const subscription = checkout.subscription;
    const userId = checkout.metadata?.userId || subscription?.metadata?.userId;

    console.log('[webhook] Checkout completed:', {
      checkoutId: checkout.id,
      subscriptionId: subscription?.id,
      userId,
      customer: checkout.customer?.email,
    });

    if (!userId || !subscription) {
      console.error('[webhook] Missing userId or subscription in checkout');
      return;
    }

    // Handle the subscription creation after checkout
    await subscriptionHelpers.handleSubscriptionSuccess(
      subscription,
      userId
    );

    console.log('[webhook] Checkout completion handled successfully');
  } catch (error) {
    console.error('[webhook] Error handling checkout completion:', error);
  }
}

// Disable body parsing for raw webhook payload
export const config = {
  api: {
    bodyParser: false,
  },
};
