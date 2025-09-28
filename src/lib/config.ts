// Environment configuration with validation
const requiredEnvVars = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
} as const;

// Validate required environment variables
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.warn(`Missing required environment variable: ${key}`);
  }
}

export const config = {
  // API Configuration
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    model: 'google/gemini-2.5-flash-image-preview', // Gemini model with image generation support
  },

  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET || '',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },

  // Payment Configuration
  creem: {
    apiKey: process.env.CREEM_API_KEY || '',
    webhookSecret: process.env.CREEM_WEBHOOK_SECRET || '',
  },

  // Storage Configuration
  cloudflare: {
    r2: {
      accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID || '',
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
      bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'prompt-gemini-photos',
      publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || '',
    },
  },

  // R2 shortcut reference
  r2: {
    accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID || '',
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
    bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'prompt-gemini-photos',
    publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || '',
  },

  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.promptgeminifotos.com',
    name: 'Prompt Gemini Fotos',
    description: 'Transform ordinary photos into professional portraits with AI',
  },

  // Generation Limits
  limits: {
    free: {
      totalGenerations: 2,
      resolution: '512x512',
      watermark: true,
    },
    pro: {
      resolution: '1024x1024',
      batchSize: 20,
      watermark: false,
    },
  },

  // Cost tracking (for internal monitoring)
  costs: {
    geminiPerGeneration: 0.02, // $0.02 per basic generation
    geminiHighRes: 0.05, // $0.05 per high-res generation
  },
} as const;

export type Config = typeof config;
