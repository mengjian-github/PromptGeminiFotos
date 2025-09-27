import { buildLocalePath } from '@/lib/locale-path';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageGenerator } from '@/components/image-generator';
import { HeroShowcase } from '@/components/hero-showcase';
import { EnhancedCTA } from '@/components/enhanced-cta';
import { EnhancedFeatures } from '@/components/enhanced-features';
import { EnhancedPricing } from '@/components/enhanced-pricing';
import { Metadata } from 'next';
import type { Locale } from '@/i18n/config';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  const keywords = locale === 'pt-BR' ? [
    'prompt gemini ensaio fotográfico',
    'prompt gemini foto profissional',
    'prompt gemini casal',
    'gerador de fotos AI',
    'inteligência artificial fotografia',
    'prompt fotografia gemini',
    'ensaio fotográfico AI',
    'foto profissional AI',
    'prompt para gemini',
    'fotografia artificial',
    'gemini prompts fotos',
    'AI photography generator'
  ] : [
    'AI photo generator',
    'professional photography prompts',
    'Gemini AI photos',
    'AI photography generator',
    'professional portrait AI',
    'photo enhancement AI',
    'artificial intelligence photography',
    'professional photo prompts',
    'AI portrait generator',
    'photo transformation AI',
    'Gemini photography prompts',
    'professional AI photos'
  ];

  const title = locale === 'pt-BR'
    ? 'Prompt Gemini Fotos - Gerador de Fotos Profissionais com IA'
    : 'Prompt Gemini Photos - Professional AI Photo Generator';

  const description = locale === 'pt-BR'
    ? 'Transforme fotos comuns em retratos profissionais com prompts de IA para Gemini. Gerador de fotos AI com prompts para ensaio fotográfico. 5 gerações gratuitas.'
    : 'Transform ordinary photos into professional portraits using AI-powered prompts for Gemini. Professional photography AI generator with free generations.';

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: buildLocalePath(currentLocale, '/'),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations();

  const keywordCards = [
    { key: 'feminino', gradient: 'from-rose-500 to-pink-500' },
    { key: 'masculino', gradient: 'from-blue-600 to-cyan-500' },
    { key: 'casal', gradient: 'from-amber-500 to-orange-600' },
    { key: 'corporativo', gradient: 'from-slate-700 to-gray-900' }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-24 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-purple-50 opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />

        <div className="relative mx-auto max-w-7xl text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-white animate-pulse">
            🚀 {t('pricing.free.features.0')}
          </Badge>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <EnhancedCTA
            primaryText={t('hero.cta')}
            secondaryText={t('hero.features')}
            freeGenerations={2}
          />

          {/* Hero Showcase */}
          <HeroShowcase />

          {/* Keyword intent section */}
          <div className="mt-16 text-left">
            <Badge variant="outline" className="mb-4 border-blue-500 text-blue-600 bg-blue-50">
              {t('keywordSection.badge')}
            </Badge>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              {t('keywordSection.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              {t('keywordSection.intro')}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {keywordCards.map((card) => (
                <div
                  key={card.key}
                  className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10`} />
                  <div className="relative p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {t(`keywordSection.cards.${card.key}.title`)}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t(`keywordSection.cards.${card.key}.description`)}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-blue-600">
                      {t(`keywordSection.cards.${card.key}.cta`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {t('keywordSection.bullet')}
            </p>
            <a
              href="#generator-section"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-7 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:from-blue-600 hover:to-purple-700"
            >
              {t('keywordSection.cta')}
            </a>
          </div>
        </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <EnhancedFeatures
            title={t('features.title')}
            subtitle={t('features.subtitle')}
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <EnhancedPricing
            title={t('pricing.title')}
            subtitle={t('pricing.subtitle')}
          />
        </div>
      </section>

      {/* Image Generator Section */}
      <section id="generator-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {t('generator.tryNow')}
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t('generator.tryGenerator')}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {t('generator.generatorDesc')}
            </p>
          </div>

          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 rounded-3xl blur-3xl -z-10" />

            <ImageGenerator
              userId={undefined} // For demo - will be replaced with actual user ID
              userTier="free"
            />
          </div>
        </div>
      </section>
    </div>
  );
}


