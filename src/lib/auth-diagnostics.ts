// Authentication diagnostics for troubleshooting OAuth issues
export function runAuthDiagnostics() {
  const diagnostics = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    issues: [] as string[],
    warnings: [] as string[],
    config: {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      googleClientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 12) + "...",
    }
  };

  // Check required environment variables
  if (!process.env.GOOGLE_CLIENT_ID) {
    diagnostics.issues.push("GOOGLE_CLIENT_ID is missing");
  }

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    diagnostics.issues.push("GOOGLE_CLIENT_SECRET is missing");
  }

  if (!process.env.NEXTAUTH_SECRET) {
    diagnostics.issues.push("NEXTAUTH_SECRET is missing");
  }

  if (!process.env.NEXTAUTH_URL) {
    diagnostics.warnings.push("NEXTAUTH_URL is not set - this may cause issues in production");
  }

  // Validate Google Client ID format
  if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
    diagnostics.issues.push("GOOGLE_CLIENT_ID does not appear to be in the correct format");
  }

  // Check if NEXTAUTH_URL matches current environment
  if (typeof window !== 'undefined' && process.env.NEXTAUTH_URL) {
    const configuredUrl = new URL(process.env.NEXTAUTH_URL);
    const currentUrl = new URL(window.location.href);

    if (configuredUrl.origin !== currentUrl.origin) {
      diagnostics.warnings.push(`NEXTAUTH_URL (${configuredUrl.origin}) doesn't match current origin (${currentUrl.origin})`);
    }
  }

  // Log results

  if (diagnostics.issues.length > 0) {
    console.error("[AUTH DIAGNOSTICS] Critical Issues:", diagnostics.issues);
  }

  if (diagnostics.warnings.length > 0) {
    console.warn("[AUTH DIAGNOSTICS] Warnings:", diagnostics.warnings);
  }

  return diagnostics;
}

// Google OAuth Setup Instructions
export function logGoogleOAuthSetup() {
  if (typeof window === 'undefined') return;

  const baseUrl = window.location.origin;

}