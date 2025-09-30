import { config } from './config';

// Creem API client configuration
const CREEM_BASE_URL = config.creem.testMode
  ? 'https://test-api.creem.io/v1'  // Test mode endpoint
  : 'https://api.creem.io/v1';       // Production endpoint

interface CreemSubscriptionData {
  productId: string;
  customerId?: string;
  customerEmail: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

interface CreemSubscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  customerId: string;
  productId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, string>;
}

interface CreemProduct {
  id: string;
  name: string;
  description: string;
  pricing: {
    monthly?: number;
    yearly?: number;
  };
  features: string[];
}

class CreemClient {
  private apiKey: string;
  private baseUrl: string;
  private testMode: boolean;

  constructor(apiKey: string, baseUrl: string = CREEM_BASE_URL, testMode: boolean = false) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.testMode = testMode;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Creem API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Create a new subscription checkout session
  async createCheckoutSession(data: CreemSubscriptionData): Promise<{ checkoutUrl: string; sessionId: string }> {
    // Convert to Creem API format (cancel_url is not supported by Creem)
    // Note: Creem API requires EITHER customer.id OR customer.email, not both
    const creemData = {
      product_id: data.productId,
      customer: data.customerId
        ? { id: data.customerId }
        : {
            email: data.customerEmail,
            ...(data.customerName && { name: data.customerName }),
          },
      success_url: data.successUrl,
      // cancel_url is not supported by Creem API
      ...(data.metadata && { metadata: data.metadata }),
    };

    const response = await this.makeRequest('/checkouts', {
      method: 'POST',
      body: JSON.stringify(creemData),
    });

    // Return in expected format
    return {
      checkoutUrl: response.checkout_url,
      sessionId: response.id,
    };
  }

  // Get subscription details
  async getSubscription(subscriptionId: string): Promise<CreemSubscription> {
    return this.makeRequest(`/subscriptions/${subscriptionId}`);
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<CreemSubscription> {
    return this.makeRequest(`/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ cancelAtPeriodEnd }),
    });
  }

  // Resume a canceled subscription
  async resumeSubscription(subscriptionId: string): Promise<CreemSubscription> {
    return this.makeRequest(`/subscriptions/${subscriptionId}/resume`, {
      method: 'POST',
    });
  }

  // Get customer subscriptions
  async getCustomerSubscriptions(customerId: string): Promise<CreemSubscription[]> {
    return this.makeRequest(`/customers/${customerId}/subscriptions`);
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Implementation would depend on Creem's webhook signature verification method
    // This is a placeholder - replace with actual implementation
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }
}

// Initialize Creem client
export const creem = new CreemClient(
  config.creem.apiKey,
  CREEM_BASE_URL,
  config.creem.testMode
);

// Product configuration based on our pricing decisions
// NOTE: Product IDs switch based on CREEM_TEST_MODE environment variable
export const PRODUCTS = {
  PRO_MONTHLY: {
    id: config.creem.testMode
      ? 'prod_5vexPt0lkM6iLgIWHF8Ezr'  // Test Mode
      : 'prod_47Q5DzL9JiQNFegff6iBw4',  // Production Mode
    name: 'Professional Monthly',
    price: 7.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited AI photo generation',
      '100+ professional prompt templates',
      'High resolution (1024x1024)',
      'No watermarks on downloads',
      'Priority email support',
      // 'Private gallery' removed,
      'Early access to new templates'
    ]
  },
  PRO_YEARLY: {
    id: config.creem.testMode
      ? 'prod_5bYhG1vTxGeB3KyW2jLYdW'  // Test Mode
      : 'prod_750GinwEKtossNTHRbatQk',  // Production Mode
    name: 'Professional Yearly',
    price: 79.99,
    currency: 'USD',
    interval: 'year',
    discount: 17,
    features: [
      'Unlimited AI photo generation',
      '100+ professional prompt templates',
      'High resolution (1024x1024)',
      'No watermarks on downloads',
      'Priority email support',
      // 'Private gallery' removed,
      'Early access to new templates',
      'Save 17% with annual billing'
    ]
  }
} as const;

// Helper functions for subscription management
export const subscriptionHelpers = {
  // Create checkout session for Pro subscription
  async createProSubscription(userId: string, userEmail: string, userName: string, planType: 'monthly' | 'yearly' = 'monthly') {
    const product = planType === 'yearly' ? PRODUCTS.PRO_YEARLY : PRODUCTS.PRO_MONTHLY;
    const baseUrl = config.app.url;

    console.log('[creem] Creating checkout session for:', {
      userId,
      userEmail,
      planType,
      productId: product.id,
      testMode: config.creem.testMode
    });

    try {
      const session = await creem.createCheckoutSession({
        productId: product.id,
        // Don't pass customerId - let Creem manage customers by email
        customerEmail: userEmail,
        customerName: userName,
        // dashboard urls removed
        successUrl: `${baseUrl}`,
        cancelUrl: `${baseUrl}`,
        metadata: {
          userId,
          planType,
          source: 'prompt-gemini-fotos'
        }
      });

      console.log('[creem] Checkout session created successfully:', session);
      return session;
    } catch (error) {
      console.error('[creem] Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  },

  // Handle successful subscription
  async handleSubscriptionSuccess(subscriptionData: any, userId: string) {
    try {
      const planType = subscriptionData.metadata?.planType || 'monthly';

      console.log('[creem] Processing subscription success:', {
        subscriptionId: subscriptionData.id,
        userId,
        status: subscriptionData.status,
        planType
      });

      // Update user in database
      const { getSupabaseAdmin } = await import('./supabase');
      const supabase = getSupabaseAdmin();

      // Update user subscription status
      const { error: userError } = await (supabase as any)
        .from('users')
        .update({
          subscription_status: 'pro',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (userError) {
        console.error('Error updating user subscription status:', userError);
        throw userError;
      }

      // Upsert subscription record (to handle multiple webhook events for same subscription)
      const { error: subscriptionError } = await (supabase as any)
        .from('subscriptions')
        .upsert({
          user_id: userId,
          creem_subscription_id: subscriptionData.id,
          status: subscriptionData.status,
          plan_type: planType,
          current_period_start: subscriptionData.current_period_start_date,
          current_period_end: subscriptionData.current_period_end_date,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'creem_subscription_id'
        });

      if (subscriptionError) {
        console.error('Error upserting subscription record:', subscriptionError);
        throw subscriptionError;
      }

      console.log('[creem] Subscription success processed successfully');
      return subscriptionData;
    } catch (error) {
      console.error('Error handling subscription success:', error);
      throw error;
    }
  },

  // Handle subscription cancellation
  async handleSubscriptionCancellation(subscriptionId: string) {
    try {
      const { getSupabaseAdmin } = await import('./supabase');
      const supabase = getSupabaseAdmin();

      // Get subscription record to find user
      const { data: subscriptionRecord, error: fetchError } = await (supabase as any)
        .from('subscriptions')
        .select('user_id')
        .eq('creem_subscription_id', subscriptionId)
        .single();

      if (fetchError || !subscriptionRecord) {
        throw new Error('Subscription not found');
      }

      // Update subscription status
      const { error: subscriptionError } = await (supabase as any)
        .from('subscriptions')
        .update({
          status: 'canceled',
        })
        .eq('creem_subscription_id', subscriptionId);

      if (subscriptionError) {
        throw subscriptionError;
      }

      // Update user status back to free
      const { error: userError } = await (supabase as any)
        .from('users')
        .update({
          subscription_status: 'free',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionRecord.user_id);

      if (userError) {
        throw userError;
      }

      return { success: true };
    } catch (error) {
      console.error('Error handling subscription cancellation:', error);
      throw error;
    }
  }
};

export default creem;
