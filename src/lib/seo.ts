import { config } from './config';
import type { MetadataRoute } from 'next';

// Structured data schemas for SEO
export interface StructuredDataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  locale?: string;
}

export function generateWebsiteStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.app.name,
    description: config.app.description,
    url: config.app.url,
    sameAs: [
      // Add social media profiles here if available
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.app.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: config.app.name,
      url: config.app.url,
    },
  };
}

export function generateWebApplicationStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.app.name,
    description: config.app.description,
    url: config.app.url,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        name: 'Free Plan',
        description: '2 AI photo generations with basic features',
        category: 'Free',
      },
      {
        '@type': 'Offer',
        price: '7.99',
        priceCurrency: 'USD',
        name: 'Professional Plan',
        description: 'Unlimited AI photo generations with professional features',
        category: 'Subscription',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '7.99',
          priceCurrency: 'USD',
          billingIncrement: 1,
          unitCode: 'MON',
        },
      },
    ],
    featureList: [
      'AI-powered photo generation',
      'Professional photography prompts',
      'Multiple image styles and categories',
      'High-resolution output (Pro)',
      'Watermark-free downloads (Pro)',
      'Template library reviewed regularly',
    ],
    screenshot: `${config.app.url}/og-image.png`,
  };
}

export function generateSoftwareApplicationStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.app.name,
    description: config.app.description,
    url: config.app.url,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    author: {
      '@type': 'Organization',
      name: config.app.name,
    },
    offers: {
      '@type': 'Offer',
      price: '7.99',
      priceCurrency: 'USD',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// SEO metadata generator
export function generateMetadata(props: StructuredDataProps) {
  const {
    title = config.app.name,
    description = config.app.description,
    image = `${config.app.url}/og-image.png`,
    url = config.app.url,
    locale = 'pt-BR',
  } = props;

  return {
    title,
    description,
    keywords: [
      'AI photo generation',
      'professional photography',
      'photo editing',
      'artificial intelligence',
      'image enhancement',
      'portrait photography',
      'digital photography',
      'AI photography',
      'photo prompts',
      'gemini AI',
      'photo transformation',
      'professional portraits'
    ].join(', '),
    authors: [{ name: config.app.name }],
    creator: config.app.name,
    publisher: config.app.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale,
      url,
      siteName: config.app.name,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@promptgeminifotos',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
      languages: {
        'pt-BR': `${config.app.url}/pt-BR`,
        'en': `${config.app.url}/en`,
      },
    },
  };
}

// Generate hreflang links for international SEO
export function generateHreflangLinks(currentPath: string = '') {
  const locales = ['pt-BR', 'en'];

  return locales.map(locale => ({
    rel: 'alternate',
    hreflang: locale,
    href: `${config.app.url}/${locale}${currentPath}`,
  }));
}

// Generate sitemap data
// Return type narrowed to Next.js sitemap entry type to satisfy strict typing
export function generateSitemapUrls(): MetadataRoute.Sitemap {
  const locales = ['pt-BR', 'en'];
  const pages = [
    '',
    // '/dashboard' removed
    '/auth/signin',
    '/pricing',
    '/about',
    '/privacy',
    '/terms',
  ];

  const urls: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      urls.push({
        url: `${config.app.url}/${locale}${page}`,
        lastModified: new Date(),
        // Use literal union values so TS infers correct type
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: locales.reduce((acc, loc) => {
            acc[loc] = `${config.app.url}/${loc}${page}`;
            return acc;
          }, {} as Record<string, string>)
        }
      });
    }
  }

  return urls;
}

// Keyword density optimization helper
export function optimizeTextForKeywords(
  text: string,
  primaryKeywords: string[],
  targetDensity: number = 0.03
): string {
  // This is a simplified implementation
  // In a real application, you'd want more sophisticated NLP processing
  const words = text.split(' ');
  const totalWords = words.length;
  const targetCount = Math.floor(totalWords * targetDensity);

  // Count existing keyword occurrences
  const keywordCounts = primaryKeywords.reduce((acc, keyword) => {
    const regex = new RegExp(keyword, 'gi');
    const matches = text.match(regex);
    acc[keyword] = matches ? matches.length : 0;
    return acc;
  }, {} as Record<string, number>);

  // This would need more sophisticated implementation
  // For now, just return the original text
  return text;
}
