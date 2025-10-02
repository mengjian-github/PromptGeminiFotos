import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { defaultLocale, locales, type Locale } from './i18n/config';

const LOCALE_COOKIE = 'NEXT_LOCALE';
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false
});

function setLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE
  });
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('[Middleware] pathname:', pathname);

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_vercel/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const hasLocaleInPath = locales.includes(firstSegment as Locale);

  console.log('[Middleware] firstSegment:', firstSegment, 'hasLocaleInPath:', hasLocaleInPath);

  if (hasLocaleInPath) {
    const response = intlMiddleware(request);
    const localeFromPath = firstSegment as Locale;

    if (request.cookies.get(LOCALE_COOKIE)?.value !== localeFromPath) {
      setLocaleCookie(response, localeFromPath);
    }

    return response;
  }

  // No locale in path - redirect to default locale (pt-BR)
  console.log('[Middleware] Redirecting to:', `/${defaultLocale}${pathname === '/' ? '' : pathname}`);
  const url = request.nextUrl.clone();
  const normalizedPath = pathname === '/' ? '' : pathname;
  url.pathname = normalizedPath ? `/${defaultLocale}${normalizedPath}` : `/${defaultLocale}`;

  const response = NextResponse.redirect(url);
  setLocaleCookie(response, defaultLocale);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};

