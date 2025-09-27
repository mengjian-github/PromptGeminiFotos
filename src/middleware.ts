import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { defaultLocale, localeMapping, locales, type Locale } from './i18n/config';

const LOCALE_COOKIE = 'NEXT_LOCALE';
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false
});

function setLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE
  });
}

function normalizeLocaleKey(locale: string | null | undefined): string | null {
  if (!locale) {
    return null;
  }

  return locale.trim().toLowerCase().replace(/_/g, '-');
}

function resolveLocale(locale: string | null | undefined): Locale | null {
  const normalized = normalizeLocaleKey(locale);
  if (!normalized) {
    return null;
  }

  if (localeMapping[normalized]) {
    return localeMapping[normalized];
  }

  const candidate = normalized as Locale;
  return locales.includes(candidate) ? candidate : null;
}

function matchFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) {
    return null;
  }

  const languages = header
    .split(',')
    .map((entry) => entry.split(';')[0]?.trim())
    .filter(Boolean);

  for (const language of languages) {
    const locale = resolveLocale(language);
    if (locale) {
      return locale;
    }
  }

  return null;
}

function matchFromCountry(request: NextRequest): Locale | null {
  // NextRequest.geo is only defined on certain platforms (e.g., Vercel). Fall back to headers.
  const reqAny = request as any;
  const country = (
    reqAny.geo?.country ??
    request.headers.get('cf-ipcountry') ??
    request.headers.get('x-vercel-ip-country') ??
    ''
  ).toUpperCase();

  if (country === 'BR') {
    return 'pt-BR';
  }

  return null;
}

// Determine the preferred locale giving precedence to manual selections.
function detectUserLocale(request: NextRequest): Locale {
  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  const localeFromHeaders = matchFromAcceptLanguage(acceptLanguage);
  if (localeFromHeaders) {
    return localeFromHeaders;
  }

  const localeFromCountry = matchFromCountry(request);
  if (localeFromCountry) {
    return localeFromCountry;
  }

  return locales.includes('en' as Locale) ? 'en' : defaultLocale;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  if (hasLocaleInPath) {
    const response = intlMiddleware(request);
    const localeFromPath = firstSegment as Locale;

    if (request.cookies.get(LOCALE_COOKIE)?.value !== localeFromPath) {
      setLocaleCookie(response, localeFromPath);
    }

    return response;
  }

  const detectedLocale = detectUserLocale(request);

  if (detectedLocale === defaultLocale) {
    const response = intlMiddleware(request);

    if (request.cookies.get(LOCALE_COOKIE)?.value !== detectedLocale) {
      setLocaleCookie(response, detectedLocale);
    }

    return response;
  }

  const url = request.nextUrl.clone();
  const normalizedPath = pathname === '/' ? '' : pathname;
  url.pathname = normalizedPath ? `/${detectedLocale}${normalizedPath}` : `/${detectedLocale}`;

  const response = NextResponse.redirect(url);
  setLocaleCookie(response, detectedLocale);

  return response;
}

export const config = {
  matcher: [
    '/',
    '/en/:path*',
    '/((?!api|_next|_vercel|.*\..*).*)'
  ]
};

