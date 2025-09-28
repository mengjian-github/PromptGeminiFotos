import { config } from './config';

// Creem API client configuration
const CREEM_BASE_URL = 'https://api.creem.io/v1';

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

  constructor(apiKey: string, baseUrl: string = CREEM_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
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
    return this.makeRequest('/checkout/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
export const creem = new CreemClient(config.creem.apiKey);

// Product configuration based on our pricing decisions
export const PRODUCTS = {
  PRO_MONTHLY: {
    id: 'promptgeminifotos', // This should match the product ID from your Creem dashboard
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
    id: 'promptgeminifotos-yearly', // This should match the yearly product ID
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

    try {
      const session = await creem.createCheckoutSession({
        productId: product.id,
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

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  },

  // Handle successful subscription
  async handleSubscriptionSuccess(subscriptionId: string, userId: string) {
    try {
      const subscription = await creem.getSubscription(subscriptionId);

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

      // Create subscription record
      const { error: subscriptionError } = await (supabase as any)
        .from('subscriptions')
        .insert({
          user_id: userId,
          creem_subscription_id: subscriptionId,
          status: subscription.status,
          current_period_start: subscription.currentPeriodStart,
          current_period_end: subscription.currentPeriodEnd,
        });

      if (subscriptionError) {
        console.error('Error creating subscription record:', subscriptionError);
        throw subscriptionError;
      }

      return subscription;
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
