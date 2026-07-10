import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown } from 'lucide-react';
import { TemplatesBrowser } from '@/components/templates-browser';
import { promptTemplates, totalTemplateCount } from '@/lib/templates';
import { generateBreadcrumbStructuredData, generateLocalizedAlternates } from '@/lib/seo';
import { buildLocalePath } from '@/lib/locale-path';
import type { Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: string }>;
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
  const currentLocale = locale as Locale;
  const canonical = buildLocalePath(currentLocale, '/templates', { absolute: true });

  return {
    title,
    description,
    keywords,
    alternates: generateLocalizedAlternates(currentLocale, '/templates'),
    openGraph: {
      title,
      description,
      url: canonical,
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

export default async function TemplatesPage({ params }: Props) {
  const { locale } = await params;
  const initialTier = 'all';
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'templatesPage' });
  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value);

  const freeTemplates = promptTemplates.filter((template) => template.tier === 'free').length;
  const premiumTemplates = promptTemplates.filter((template) => template.tier === 'premium').length;
  const categories = new Set(promptTemplates.map((template) => template.category)).size;
  const categoryGroups = Array.from(new Set(promptTemplates.map((template) => template.category))).sort();

  const stats: StatsSummary = {
    total: totalTemplateCount,
    free: freeTemplates,
    premium: premiumTemplates,
    categories
  };
  const isPortuguese = locale === 'pt-BR';
  const templateItemListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isPortuguese ? 'Templates de prompt Gemini por intenção' : 'Gemini prompt templates by intent',
    itemListElement: promptTemplates.slice(0, 24).map((template, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: template.name,
      description: template.description,
      url: buildLocalePath(locale as Locale, `/generator?template=${encodeURIComponent(template.id)}`, { absolute: true }),
    })),
  };
  const intentClusters = [
    {
      title: isPortuguese ? 'Fotos profissionais e LinkedIn' : 'Professional and LinkedIn photos',
      body: isPortuguese
        ? 'Comece por headshot, CV e retrato corporativo quando a busca contém foto profissional Gemini, LinkedIn ou currículo.'
        : 'Start with headshot, CV, and corporate portrait templates when the query mentions Gemini professional photo, LinkedIn, or resume.',
    },
    {
      title: isPortuguese ? 'Ensaios pessoais e casal' : 'Personal and couple sessions',
      body: isPortuguese
        ? 'Use os filtros de feminino, masculino, casal, família e aniversário para transformar intenção ampla em prompt com pose, lente e luz.'
        : 'Use female, male, couple, family, and birthday filters to turn broad intent into a prompt with pose, lens, and lighting.',
    },
    {
      title: isPortuguese ? 'Fluxo de cópia para Gemini' : 'Copy workflow for Gemini',
      body: isPortuguese
        ? 'Cada template leva ao compositor com categoria e estilo prontos; copie o texto final ou abra o Gemini explicitamente.'
        : 'Each template opens the composer with category and style ready; copy the final text or explicitly open Gemini.',
    },
  ];
  const templateFaqs = [
    {
      question: isPortuguese ? 'Qual template usar para foto profissional no Gemini?' : 'Which template should I use for a professional Gemini photo?',
      answer: isPortuguese
        ? 'Comece por LinkedIn/CV ou retrato corporativo: esses modelos já incluem fundo neutro, lente 85mm, luz suave e instruções para preservar identidade.'
        : 'Start with LinkedIn/CV or corporate portrait templates: they already include neutral backgrounds, 85mm lens notes, soft lighting, and identity-preserving instructions.',
    },
    {
      question: isPortuguese ? 'Os templates geram imagem dentro do site?' : 'Do the templates generate images on this site?',
      answer: isPortuguese
        ? 'Não. A página ajuda você a escolher e adaptar o prompt; o resultado final é copiado para usar no Gemini quando você decidir abrir a ferramenta externa.'
        : 'No. This page helps you choose and adapt the prompt; the final output is copied for Gemini when you decide to open the external tool.',
    },
    {
      question: isPortuguese ? 'Como escolher entre ensaio feminino, casal e corporativo?' : 'How should I choose between female, couple, and corporate templates?',
      answer: isPortuguese
        ? 'Use o objetivo final: LinkedIn/CV para credibilidade profissional, casal/pre-wedding para emoção e narrativa, feminino/masculino para editorial e redes sociais.'
        : 'Use the final goal: LinkedIn/CV for professional credibility, couple/pre-wedding for emotion and story, and female/male portraits for editorial or social content.',
    },
  ];
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: templateFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: isPortuguese ? 'Início' : 'Home', url: buildLocalePath(locale as Locale, '/', { absolute: true }) },
    { name: isPortuguese ? 'Templates' : 'Templates', url: buildLocalePath(locale as Locale, '/templates', { absolute: true }) },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(templateItemListStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
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

          <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-4 text-left md:grid-cols-3">
            {categoryGroups.map((category) => {
              const groupCount = promptTemplates.filter((template) => template.category === category).length;
              return (
                <section key={category} className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t(`browser.filters.categories.${category}`)}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {locale === 'pt-BR'
                      ? `${formatNumber(groupCount)} prompts para copiar, adaptar e usar no Gemini por cenário.`
                      : `${formatNumber(groupCount)} prompts to copy, adapt, and use in Gemini by scenario.`}
                  </p>
                </section>
              );
            })}
          </div>

          <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-4 text-left md:grid-cols-3">
            {intentClusters.map((cluster) => (
              <section key={cluster.title} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <h2 className="text-base font-semibold text-gray-900">{cluster.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{cluster.body}</p>
              </section>
            ))}
          </div>

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

          <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-blue-100 bg-white/85 p-5 text-left shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isPortuguese ? 'Atalho: copie um prompt e teste no Gemini' : 'Shortcut: copy a prompt and test it in Gemini'}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {isPortuguese
                    ? 'Use filtros por cenário, escolha um template e abra o compositor já pré-preenchido. Esse clique é rastreado como template_select para medir a conversão natural.'
                    : 'Filter by scenario, choose a template, and open the composer prefilled. This click is tracked as template_select to measure natural conversion.'}
                </p>
              </div>
              <Button className="shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600" asChild>
                <Link href={buildLocalePath(locale as Locale, '/generator')}>
                  {isPortuguese ? 'Abrir compositor' : 'Open composer'}
                </Link>
              </Button>
            </div>
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

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <Badge variant="outline" className="mb-4 border-blue-200 bg-blue-50 text-blue-700">
            FAQ
          </Badge>
          <h2 className="text-2xl font-bold text-gray-900">
            {isPortuguese ? 'Perguntas rápidas sobre templates Gemini' : 'Quick questions about Gemini templates'}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {templateFaqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="text-base font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
