import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { config } from "./config";
import { runAuthDiagnostics } from "./auth-diagnostics";
import { logNetworkTroubleshooting } from "./network-diagnostics";

// Run diagnostics on startup
runAuthDiagnostics();

// Custom fetch with retry logic for proxy stability
const fetchWithRetry = async (url: RequestInfo | URL, options?: RequestInit, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        // Increase timeout
        signal: AbortSignal.timeout(30000), // 30 seconds
      });
      return response;
    } catch (error: any) {
      console.log(`[AUTH] Fetch attempt ${i + 1}/${retries} failed:`, error.message);
      if (i === retries - 1) throw error;
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
};

// Debug configuration on startup

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Temporarily disable adapter until database tables are properly set up
  // adapter: SupabaseAdapter({
  //   url: config.supabase.url,
  //   secret: config.supabase.serviceRoleKey,
  // }),

  providers: [
    GoogleProvider({
      clientId: config.auth.google.clientId,
      clientSecret: config.auth.google.clientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],

  // Add explicit trust host for development
  trustHost: true,

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  callbacks: {
    async session({ session, token, user }) {

      // Send properties to the client
      if (session.user && session.user.email) {
        // Get user ID from database by email
        try {
          const { getSupabaseAdmin } = await import('./supabase');
          const supabase = getSupabaseAdmin();

          const { data: dbUser } = await (supabase as any)
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single();

          if (dbUser) {
            (session.user as any).id = dbUser.id;
          }
        } catch (error) {
          console.error('[AUTH] Error fetching user ID from database:', error);
        }
      }
      return session;
    },

    async jwt({ token, user, account, profile }) {

      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async signIn({ user, account, profile, email, credentials }) {

      // Allow sign in
      return true;
    },

    async redirect({ url, baseUrl }) {

      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('[AUTH] signIn event triggered:', {
        userId: user.id,
        email: user.email,
        name: user.name,
        isNewUser
      });

      // Initialize user in our database (upsert to ensure user exists)
      if (user.email) {
        try {
          console.log('[AUTH] Importing Supabase admin client...');
          const { getSupabaseAdmin } = await import('./supabase');
          const supabase = getSupabaseAdmin();

          console.log('[AUTH] Upserting user record...');

          // Check if user exists by email
          const { data: existingUser } = await (supabase as any)
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

          let data, error;

          if (existingUser) {
            // Update existing user
            console.log('[AUTH] Updating existing user:', existingUser.id);
            const result = await (supabase as any)
              .from('users')
              .update({
                name: user.name,
                avatar_url: user.image,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingUser.id)
              .select();

            data = result.data;
            error = result.error;
          } else {
            // Insert new user
            console.log('[AUTH] Inserting new user');
            const result = await (supabase as any)
              .from('users')
              .insert({
                id: user.id,
                email: user.email,
                name: user.name,
                avatar_url: user.image,
                subscription_status: 'free',
                free_generations_used: 0,
                free_generations_limit: 2,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select();

            data = result.data;
            error = result.error;
          }

          if (error) {
            console.error("[AUTH] Error upserting user record:", error);
          } else {
            console.log("[AUTH] User record upserted successfully:", { userId: user.id, data });
          }
        } catch (error) {
          console.error("[AUTH] Error in signIn event:", error);
        }
      } else {
        console.warn('[AUTH] No email in user object, skipping database insert');
      }
    },

    async signOut() {}
  },

  logger: {
    error(error) {
      console.error(`[AUTH ERROR]`, error);
      const message = (error && typeof error === 'object' && 'message' in error) ? String((error as any).message) : '';
      if (message.includes('fetch failed') ||
          message.includes('ENOTFOUND') ||
          message.includes('ECONNREFUSED') ||
          message.includes('network') ||
          message.includes('timeout')) {
        console.error('[AUTH ERROR] Network connectivity issue detected!');
        logNetworkTroubleshooting();
      }
    },
    warn(code) {
      console.warn(`[AUTH WARN] ${code}`);
    },
    debug(code) {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[AUTH DEBUG] ${code}`);
      }
    }
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development",
});
