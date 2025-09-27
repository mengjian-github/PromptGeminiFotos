import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { config } from "./config";
import { runAuthDiagnostics } from "./auth-diagnostics";
import { logNetworkTroubleshooting } from "./network-diagnostics";

// Run diagnostics on startup
runAuthDiagnostics();

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
      if (session.user) {
        // Ensure type safety: only assign when available
        const uid = (user && 'id' in user ? (user as any).id : undefined) ?? token.sub;
        if (uid) {
          // Extend session.user to include id at runtime
          (session.user as any).id = uid;
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

      // Initialize new user in our database
      if (isNewUser && user.email) {
        try {
          const { getSupabaseAdmin } = await import('./supabase');
          const supabase = getSupabaseAdmin();

          // Create user record with default settings
          // Insert user record; cast to any to avoid Postgrest generic type issues without generated types
          const { error } = await (supabase as any)
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
            });

          if (error) {
            console.error("Error creating user record:", error);
          }
        } catch (error) {
          console.error("Error in signIn event:", error);
        }
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
