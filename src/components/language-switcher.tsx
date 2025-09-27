'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { locales, localeLabels, type Locale } from '@/i18n/config';
import { useLocale } from 'next-intl';
import { buildLocalePath } from '@/lib/locale-path';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  const stripLocaleFromPath = (path: string): string => {
    if (!path) {
      return '/';
    }

    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) {
      return '/';
    }

    if (locales.includes(segments[0] as Locale)) {
      const remainder = segments.slice(1).join('/');
      return remainder ? `/${remainder}` : '/';
    }

    return path.startsWith('/') ? path : `/${path}`;
  };

  const flagForLocale = (locale: Locale) => {
    switch (locale) {
      case 'pt-BR':
        return '🇧🇷';
      case 'en':
        return '🇺🇸';
      default:
        return '🌐';
    }
  };

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      return;
    }

    const resolvedPathname = pathname || '/';
    const basePath = stripLocaleFromPath(resolvedPathname);
    const targetPath = buildLocalePath(newLocale, basePath);

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    window.location.href = targetPath;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-auto px-2">
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {localeLabels[currentLocale]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className={`${
              locale === currentLocale ? 'bg-accent' : ''
            } cursor-pointer`}
          >
            <span className="mr-2">
              {flagForLocale(locale)}
            </span>
            {localeLabels[locale]}
            {locale === currentLocale && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
