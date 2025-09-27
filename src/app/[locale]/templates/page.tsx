import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown } from 'lucide-react';
import { TemplatesBrowser } from '@/components/templates-browser';
import { promptTemplates, totalTemplateCount } from '@/lib/templates';
import { buildLocalePath } from '@/lib/locale-path';
import type { Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ tier?: string | string[] }>;
}

interface StatsSummary {
  total: number;
  free: number;
  premium: number;
  categories: number;
}

type Translator = (key: string, values?: Record<string, string | number | Date>) => string;


function TemplateStats({ stats, formatNumber, t }: {
  stats: StatsSummary;
  formatNumber: (value: number) => string;
  t: Translator;
}) {
  const cards = [
    {
      key: 'total' as const,
      value: stats.total,
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      key: 'free' as const,
      value: stats.free,
      gradient: 'from-green-500 to-blue-500'
    },
    {
      key: 'premium' as const,
      value: stats.premium,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      key: 'categories' as const,
      value: stats.categories,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
      {cards.map((card) => (
        <div
          key={card.key}
          className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm"
        >
          <div
            className={`text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
          >
            {formatNumber(card.value)}
          </div>
          <div className="text-sm text-gray-600">
            {t(`stats.${card.key}.label`)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {t(`stats.${card.key}.description`)}
          </div>
        </div>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const count = totalTemplateCount;
  const t = await getTranslations({ locale, namespace: 'templatesPage.meta' });

  const title = t('title', { count });
  const description = t('description', { count });
  const keywordsRaw = t('keywords', { count });
  const keywords = keywordsRaw.split(',').map((keyword) => keyword.trim());
  const image = t('image');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}

export default async function TemplatesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  const tierParamRaw = Array.isArray(query.tier) ? query.tier[0] : query.tier;
  const initialTier = tierParamRaw === 'free' || tierParamRaw === 'premium' ? tierParamRaw : 'all';
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'templatesPage' });
  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value);

  const freeTemplates = promptTemplates.filter((template) => template.tier === 'free').length;
  const premiumTemplates = promptTemplates.filter((template) => template.tier === 'premium').length;
  const categories = new Set(promptTemplates.map((template) => template.category)).size;

  const stats: StatsSummary = {
    total: totalTemplateCount,
    free: freeTemplates,
    premium: premiumTemplates,
    categories
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <section className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 opacity-60" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative mx-auto max-w-7xl text-center">
          <Badge
            variant="secondary"
            className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('hero.badge')}
          </Badge>

          <h1 className="mx-auto max-w-5xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            {t.rich('hero.title', {
              highlight: (chunks) => (
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
              count: formatNumber(stats.total)
            })}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 sm:text-xl leading-relaxed mb-8">
            {t.rich('hero.description', {
              strong: (chunks) => <strong className="text-gray-900">{chunks}</strong>,
              count: formatNumber(stats.total)
            })}
          </p>

          <TemplateStats stats={stats} formatNumber={formatNumber} t={t} />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link
                href={buildLocalePath(
                  locale as Locale,
                  '/templates?tier=free#templates-browser'
                )}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t('hero.cta.free')}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-300"
              asChild
            >
              <Link
                href={buildLocalePath(
                  locale as Locale,
                  '/templates?tier=premium#templates-browser'
                )}
              >
                <Crown className="w-5 h-5 mr-2" />
                {t('hero.cta.premium')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="templates-browser" className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12 text-gray-500">
                {t('browser.loading')}
              </div>
            }
          >
            <TemplatesBrowser initialTemplates={promptTemplates} initialTier={initialTier} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
