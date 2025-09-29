import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import '../globals.css';
import { locales, type Locale } from '@/i18n/config';
import { buildLocalePath } from '@/lib/locale-path';
import { Providers } from '@/components/providers';
import { EnhancedNavigation } from '@/components/enhanced-navigation';
import { generateMetadata as generateSEOMetadata, generateWebsiteStructuredData, generateWebApplicationStructuredData } from '@/lib/seo';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const isPortuguese = locale === 'pt-BR';
  const brandName = isPortuguese ? 'Prompt Gemini Fotos' : 'Prompt Gemini Photos';
  const defaultTitle = isPortuguese
    ? `${brandName} - Gerador de Fotos com IA`
    : `${brandName} - AI Photo Generator`;
  const defaultDescription = isPortuguese
    ? 'Transforme fotos comuns em retratos profissionais com prompts de IA para Gemini.'
    : 'Transform ordinary photos into professional portraits with AI-powered prompts for Gemini.';
  const currentLocale = locale as Locale;
  const canonicalPath = buildLocalePath(currentLocale, '/');
  const languageAlternates = Object.fromEntries(
    locales.map((availableLocale) => [
      availableLocale,
      buildLocalePath(availableLocale, '/')
    ])
  );

  return {
    ...generateSEOMetadata({
      title: defaultTitle,
      description: defaultDescription,
      url: 'https://www.promptgeminifotos.com',
      locale,
    }),
    metadataBase: new URL('https://www.promptgeminifotos.com'),
    title: {
      template: `%s | ${brandName}`,
      default: defaultTitle,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      ],
      shortcut: '/favicon.ico',
      apple: '/icon.svg',
    },
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: 'https://www.promptgeminifotos.com',
      siteName: brandName,
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
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
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    console.warn('[layout] unsupported locale received: "' + locale + '"');
    notFound();
  }


  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();
  const supportEmail =
    (messages as Record<string, any>)?.contact?.info?.email?.address ??
    'kian@promptgeminifotos.com';
  const [tFooter, tNavigation] = await Promise.all([
    getTranslations('footer'),
    getTranslations('navigation')
  ]);
  const currentLocale = locale as Locale;
  const localizedLinks = {
    home: buildLocalePath(currentLocale, '/'),
    templates: buildLocalePath(currentLocale, '/templates'),
    pricing: buildLocalePath(currentLocale, '/#pricing'),
  } as const;

  const websiteStructuredData = generateWebsiteStructuredData();
  const appStructuredData = generateWebApplicationStructuredData();

  return (
    <html lang={locale} dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(appStructuredData),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <EnhancedNavigation />
            <main>
              {children}
            </main>
            <footer className="bg-gray-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Brand */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">PG</span>
                      </div>
                      <span className="text-2xl font-bold">{tNavigation('brand')}</span>
                  </div>
                    <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                      {tFooter('description')}
                    </p>
                    <div className="flex space-x-4">
                      <a
                        href={`mailto:${supportEmail}`}
                        className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                        aria-label={tFooter('contact')}
                      >
                        <span aria-hidden>📧</span>
                      </a>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{tFooter('quickLinks')}</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link href={localizedLinks.home} className="hover:text-white transition-colors">{tFooter('home')}</Link></li>
                      <li><Link href={localizedLinks.templates} className="hover:text-white transition-colors">{tFooter('templates')}</Link></li>
                      <li><Link href={localizedLinks.pricing} className="hover:text-white transition-colors">{tFooter('pricing')}</Link></li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{tFooter('support')}</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link href={buildLocalePath(currentLocale, '/terms')} className="hover:text-white transition-colors">{tFooter('terms')}</Link></li>
                      <li><Link href={buildLocalePath(currentLocale, '/privacy')} className="hover:text-white transition-colors">{tFooter('privacy')}</Link></li>
                      <li><Link href={buildLocalePath(currentLocale, '/contact')} className="hover:text-white transition-colors">{tFooter('contact')}</Link></li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                      © 2025 {tNavigation('brand')}. {tFooter('allRightsReserved')}.
                    </p>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">🛡️ {tFooter('secure')}</span>
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">🔒 {tFooter('lgpd')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
