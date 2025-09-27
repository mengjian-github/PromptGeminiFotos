import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { buildLocalePath } from './src/lib/locale-path';
import { locales, defaultLocale, type Locale } from './src/i18n/locales';

const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

function hasLocalePrefix(pathname: string): boolean {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

function detectBrazil(req: NextRequest): boolean {
  const geoHeader = req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry');
  const geoCountry = geoHeader?.toUpperCase();
  if (geoCountry === 'BR') {
    return true;
  }

  const acceptLanguage = req.headers.get('accept-language');
  if (!acceptLanguage) {
    return false;
  }

  return acceptLanguage
    .split(',')
    .map((section) => section.trim().toLowerCase())
    .some((section) => section.startsWith('pt-br'));
}

function getManualLocale(req: NextRequest): Locale | null {
  const manualLocale = req.cookies.get('NEXT_LOCALE')?.value;
  if (manualLocale && locales.includes(manualLocale as Locale)) {
    return manualLocale as Locale;
  }
  return null;
}

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const manualLocale = getManualLocale(req);
  const hasPrefix = hasLocalePrefix(pathname);
  if (!hasPrefix) {
    const preferredLocale: Locale = manualLocale ?? (detectBrazil(req) ? defaultLocale : 'en');
    const url = nextUrl.clone();
    url.pathname = buildLocalePath(preferredLocale, pathname);
    return NextResponse.redirect(url);
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*|api).*)',
  ],
};
