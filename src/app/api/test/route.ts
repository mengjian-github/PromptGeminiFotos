import { NextRequest, NextResponse } from 'next/server';
import { testOpenRouterConnection } from '@/lib/openrouter';
import { getSupabaseClient } from '@/lib/supabase';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  const tests: Record<string, boolean | string | Record<string, boolean>> = {};

  try {
    // Test environment variables
    tests.envVars = {
      openrouter: !!config.openrouter.apiKey,
      supabase: !!config.supabase.url && !!config.supabase.anonKey,
      appConfig: !!config.app.url
    };

    // Test OpenRouter connection
    try {
      tests.openrouter = await testOpenRouterConnection();
    } catch (error) {
      tests.openrouter = false;
      tests.openrouterError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test Supabase connection
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('users').select('count').limit(1);
      tests.supabase = !error;
      if (error) {
        tests.supabaseError = error.message;
      }
    } catch (error) {
      tests.supabase = false;
      tests.supabaseError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Overall health
    const isHealthy = tests.openrouter && tests.supabase;

    return NextResponse.json({
      healthy: isHealthy,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      tests
    }, {
      status: isHealthy ? 200 : 503
    });

  } catch (error) {
    console.error('Health check error:', error);

    return NextResponse.json({
      healthy: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      tests
    }, {
      status: 503
    });
  }
}
