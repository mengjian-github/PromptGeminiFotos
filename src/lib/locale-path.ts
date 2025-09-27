import type { Locale } from '@/i18n/config';

function normalizePath(path: string): string {
  if (!path.startsWith('/')) {
    return `/${path}`;
  }
  return path;
}

export function buildLocalePath(locale: Locale, rawPath: string): string {
  const path = normalizePath(rawPath);

  if (path.startsWith('/api') || path.startsWith('/_next')) {
    return path;
  }

  const localePrefix = `/${locale}`;
  if (path === localePrefix || path.startsWith(`${localePrefix}/`)) {
    return path;
  }

  const [pathnameAndQuery, hashFragment] = path.split('#');
  const [pathname, queryFragment] = pathnameAndQuery.split('?');

  const trailingPath = pathname === '/' || pathname === '' ? '' : pathname;
  const localizedPath = `${localePrefix}${trailingPath}`;

  const query = queryFragment ? `?${queryFragment}` : '';
  const hash = hashFragment ? `#${hashFragment}` : '';

  return `${localizedPath}${query}${hash}`;
}

export function isPathActive(pathname: string, locale: Locale, targetPath: string): boolean {
  const normalizedPathname = pathname || '/';
  const [targetWithoutHash] = targetPath.split('#');
  const [targetWithoutQuery] = (targetWithoutHash ?? '').split('?');
  const normalizedTarget = normalizePath(targetWithoutQuery || '/');
  const localizedTarget = buildLocalePath(locale, normalizedTarget);
  const [localizedPathWithoutHash] = localizedTarget.split('#');

  if (!localizedPathWithoutHash) {
    return false;
  }

  if (normalizedTarget === '/') {
    return (
      normalizedPathname === localizedPathWithoutHash ||
      (localizedPathWithoutHash === '/' && normalizedPathname === '')
    );
  }

  return (
    normalizedPathname === localizedPathWithoutHash ||
    normalizedPathname.startsWith(`${localizedPathWithoutHash}/`)
  );
}
