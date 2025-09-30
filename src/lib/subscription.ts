import { getSupabaseAdmin } from '@/lib/supabase';

export interface UserSubscriptionData {
  id: string;
  subscriptionStatus: 'free' | 'pro';
  planType?: 'monthly' | 'yearly';
  generationsUsed: number;
  generationsLimit: number;
  subscriptionId?: string;
  currentPeriodEnd?: string;
}

const FREE_GENERATION_LIMIT = 2;

export async function getUserSubscriptionData(userId: string): Promise<UserSubscriptionData> {
  try {
    const supabase = getSupabaseAdmin();

    // Get user data with subscription info
    const { data: userData, error: userError } = await (supabase as any)
      .from('users')
      .select(`
        id,
        subscription_status,
        free_generations_used,
        free_generations_limit,
        subscriptions (
          creem_subscription_id,
          status,
          plan_type,
          current_period_end
        )
      `)
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user subscription data:', userError);
      // Return default data if user doesn't exist yet
      return {
        id: userId,
        subscriptionStatus: 'free',
        generationsUsed: 0,
        generationsLimit: FREE_GENERATION_LIMIT,
      };
    }

    const subscriptionStatus = ((userData as any).subscription_status || 'free') as 'free' | 'pro';
    const rawGenerationsUsed = (userData as any).free_generations_used;
    const generationsUsed = typeof rawGenerationsUsed === 'number' && Number.isFinite(rawGenerationsUsed)
      ? Math.max(0, rawGenerationsUsed)
      : 0;
    const subscription = (userData as any).subscriptions?.[0];

    return {
      id: userId,
      subscriptionStatus: subscriptionStatus as 'free' | 'pro',
      planType: subscription?.plan_type as 'monthly' | 'yearly' | undefined,
      generationsUsed,
      generationsLimit: subscriptionStatus === 'pro'
        ? Infinity
        : FREE_GENERATION_LIMIT,
      subscriptionId: subscription?.creem_subscription_id,
      currentPeriodEnd: subscription?.current_period_end,
    };
  } catch (error) {
    console.error('Unexpected error fetching subscription data:', error);
    // Return default data on error
    return {
      id: userId,
      subscriptionStatus: 'free',
      generationsUsed: 0,
      generationsLimit: FREE_GENERATION_LIMIT,
    };
  }
}

export async function incrementUserGenerations(userId: string): Promise<{ success: boolean; newCount: number }> {
  try {
    const supabase = getSupabaseAdmin();

    // Get current user data
    const userData = await getUserSubscriptionData(userId);

    // Check if user has reached limit (only for free users)
    if (userData.subscriptionStatus === 'free' && userData.generationsUsed >= userData.generationsLimit) {
      return { success: false, newCount: userData.generationsUsed };
    }

    if (userData.subscriptionStatus === 'pro') {
      // Pro users are unlimited; nothing to persist for free counters
      return { success: true, newCount: userData.generationsUsed };
    }

    // Increment generations count
    const newCount = userData.generationsUsed + 1;

    const { error } = await (supabase as any)
      .from('users')
      .update({
        free_generations_used: newCount,
        free_generations_limit: FREE_GENERATION_LIMIT,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error incrementing user generations:', error);
      return { success: false, newCount: userData.generationsUsed };
    }

    return { success: true, newCount };
  } catch (error) {
    console.error('Unexpected error incrementing generations:', error);
    return { success: false, newCount: 0 };
  }
}

export async function resetUserGenerations(userId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();

    const { error } = await (supabase as any)
      .from('users')
      .update({
        free_generations_used: 0,
        free_generations_limit: FREE_GENERATION_LIMIT,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error resetting user generations:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error resetting generations:', error);
    return false;
  }
}
