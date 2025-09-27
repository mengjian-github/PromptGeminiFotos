import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

// Database types (will be auto-generated later)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          subscription_status: 'free' | 'pro';
          free_generations_used: number;
          free_generations_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          subscription_status?: 'free' | 'pro';
          free_generations_used?: number;
          free_generations_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          subscription_status?: 'free' | 'pro';
          free_generations_used?: number;
          free_generations_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      generations: {
        Row: {
          id: string;
          user_id: string | null;
          original_image_url: string | null;
          generated_image_url: string;
          prompt_text: string;
          category: 'portrait' | 'couple' | 'professional';
          style: 'dramatic' | 'natural' | 'cinematic' | 'linkedin' | 'executive';
          resolution: '512x512' | '1024x1024';
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          original_image_url?: string | null;
          generated_image_url: string;
          prompt_text: string;
          category: 'portrait' | 'couple' | 'professional';
          style: 'dramatic' | 'natural' | 'cinematic' | 'linkedin' | 'executive';
          resolution: '512x512' | '1024x1024';
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          original_image_url?: string | null;
          generated_image_url?: string;
          prompt_text?: string;
          category?: 'portrait' | 'couple' | 'professional';
          style?: 'dramatic' | 'natural' | 'cinematic' | 'linkedin' | 'executive';
          resolution?: '512x512' | '1024x1024';
          is_public?: boolean;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          creem_subscription_id: string;
          status: 'active' | 'canceled' | 'past_due';
          current_period_start: string;
          current_period_end: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          creem_subscription_id: string;
          status: 'active' | 'canceled' | 'past_due';
          current_period_start: string;
          current_period_end: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          creem_subscription_id?: string;
          status?: 'active' | 'canceled' | 'past_due';
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: 'portrait' | 'couple' | 'professional';
          style: 'dramatic' | 'natural' | 'cinematic' | 'linkedin' | 'executive';
          prompt_template: string;
          is_premium: boolean;
          usage_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category: 'portrait' | 'couple' | 'professional';
          style: 'dramatic' | 'natural' | 'cinematic' | 'linkedin' | 'executive';
          prompt_template: string;
          is_premium?: boolean;
          usage_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: 'portrait' | 'couple' | 'professional';
          style?: 'dramatic' | 'natural' | 'cinematic' | 'linkedin' | 'executive';
          prompt_template?: string;
          is_premium?: boolean;
          usage_count?: number;
          created_at?: string;
        };
      };
    };
  };
}

// Create Supabase client for client-side operations
let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient && config.supabase.url && config.supabase.anonKey) {
    supabaseClient = createClient<Database>(
      config.supabase.url,
      config.supabase.anonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  if (!supabaseClient) {
    throw new Error('Supabase client not initialized. Check environment variables.');
  }

  return supabaseClient;
}

// Create admin client for server-side operations
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!config.supabase.url || !config.supabase.serviceRoleKey) {
    throw new Error('Supabase admin client not configured. Check environment variables.');
  }

  return createClient<Database>(
    config.supabase.url,
    config.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Check if user has reached free generation limit
  async canUserGenerate(userId: string): Promise<{ canGenerate: boolean; remaining: number }> {
    const supabase = getSupabaseClient();

    const { data: user, error } = await (supabase as any)
      .from('users')
      .select('subscription_status, free_generations_used, free_generations_limit')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return { canGenerate: false, remaining: 0 };
    }

    // Pro users can always generate
    if (user.subscription_status === 'pro') {
      return { canGenerate: true, remaining: -1 }; // -1 indicates unlimited
    }

    // Check free user limits
    const remaining = user.free_generations_limit - user.free_generations_used;
    return {
      canGenerate: remaining > 0,
      remaining: remaining
    };
  },

  // Increment user generation count
  async incrementGenerationCount(userId: string): Promise<boolean> {
    const supabase = getSupabaseClient();

    // Use any to allow Postgres RPC expression in update payload without strict generated types
    const { error } = await (supabase as any)
      .from('users')
      .update({
        free_generations_used: (supabase as any).rpc('increment', { x: 1 }),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    return !error;
  },

  // Save generation record
  async saveGeneration(generation: Database['public']['Tables']['generations']['Insert']): Promise<string | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await (supabase as any)
      .from('generations')
      .insert(generation)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving generation:', error);
      return null;
    }

    return data.id;
  },

  // Get user's generations
  async getUserGenerations(userId: string, limit: number = 10): Promise<Database['public']['Tables']['generations']['Row'][]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user generations:', error);
      return [];
    }

    return data || [];
  },

  // Removed: public gallery feature no longer used

  // Get prompt templates
  async getTemplates(category?: string, isPremium?: boolean): Promise<Database['public']['Tables']['templates']['Row'][]> {
    const supabase = getSupabaseClient();

    let query = supabase.from('templates').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (isPremium !== undefined) {
      query = query.eq('is_premium', isPremium);
    }

    const { data, error } = await query.order('usage_count', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      return [];
    }

    return data || [];
  }
};

// Export the default client
export const supabase = getSupabaseClient;
