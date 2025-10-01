import { MetadataRoute } from 'next';
import { config } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = config.app.url.trim();
  let host = baseUrl;
  let normalizedBaseUrl = baseUrl;

  while (normalizedBaseUrl.endsWith('/')) {
    normalizedBaseUrl = normalizedBaseUrl.slice(0, -1);
  }

  let sitemap = `${normalizedBaseUrl}/sitemap.xml`;

  try {
    const parsedUrl = new URL(baseUrl);
    host = parsedUrl.host;
    sitemap = new URL('/sitemap.xml', parsedUrl).toString();
  } catch {
    if (host.startsWith('https://')) {
      host = host.slice('https://'.length);
    } else if (host.startsWith('http://')) {
      host = host.slice('http://'.length);
    }

    const slashIndex = host.indexOf('/');
    if (slashIndex !== -1) {
      host = host.slice(0, slashIndex);
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          // removed dashboard route
          '/auth/',
          '/_next/',
          '/.well-known/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended',
        disallow: ['/'],
      },
    ],
    sitemap,
    host,
  };
}
