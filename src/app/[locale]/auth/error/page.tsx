import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { buildLocalePath } from '@/lib/locale-path';
import type { Locale } from '@/i18n/config';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function AuthErrorPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error } = await searchParams;

  setRequestLocale(locale);
  const t = await getTranslations();
  const currentLocale = locale as Locale;
  const homeHref = buildLocalePath(currentLocale, '/');

  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case 'Configuration':
        return 'Authentication service is not properly configured. Please contact support.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'Default':
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In Failed</CardTitle>
            <CardDescription>
              We encountered an issue while trying to sign you in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href={homeHref}>
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/api/auth/signin">
                  Try Again
                </Link>
              </Button>
            </div>

            {error === 'Configuration' && (
              <div className="text-sm text-gray-600">
                <p className="font-semibold">Common causes:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Missing or invalid OAuth credentials</li>
                  <li>Incorrect callback URL configuration</li>
                  <li>Environment variables not loaded properly</li>
                </ul>
                <p className="mt-3">
                  If you're a developer, check the console for more details.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}