import { getSupabaseAdmin } from '@/lib/supabase';

export interface UserSubscriptionData {
  id: string;
  subscriptionStatus: 'free' | 'pro';
  generationsUsed: number;
  generationsLimit: number;
  subscriptionId?: string;
  currentPeriodEnd?: string;
}

export async function getUserSubscriptionData(userId: string): Promise<UserSubscriptionData> {
  try {
    const supabase = getSupabaseAdmin();

    // Get user data with subscription info
    const { data: userData, error: userError } = await (supabase as any)
      .from('users')
      .select(`
        id,
        subscription_status,
        generations_used,
        subscriptions (
          creem_subscription_id,
          status,
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
        generationsLimit: 2,
      };
    }

    const subscriptionStatus = (userData as any).subscription_status || 'free';
    const generationsUsed = (userData as any).generations_used || 0;
    const subscription = (userData as any).subscriptions?.[0];

    return {
      id: userId,
      subscriptionStatus: subscriptionStatus as 'free' | 'pro',
      generationsUsed,
      generationsLimit: subscriptionStatus === 'pro' ? Infinity : 2,
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
      generationsLimit: 2,
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

    // Increment generations count
    const newCount = userData.generationsUsed + 1;

    const { error } = await (supabase as any)
      .from('users')
      .update({
        generations_used: newCount,
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
        generations_used: 0,
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
