import Link from 'next/link';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HowToTutorial } from '@/components/how-to-tutorial';
import { buildLocalePath } from '@/lib/locale-path';
import type { Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  const t = await getTranslations({ locale: currentLocale, namespace: 'howToTutorialPage.meta' });
  const keywords = t('keywords').split(',').map((keyword) => keyword.trim());
  const canonical = buildLocalePath(currentLocale, '/tutorial', { absolute: true });

  return {
    title: t('title'),
    description: t('description'),
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonical,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function TutorialPage({ params }: Props) {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  setRequestLocale(currentLocale);

  const [tHero, tContent] = await Promise.all([
    getTranslations('howToTutorialPage.hero'),
    getTranslations('howToTutorialPage.content'),
  ]);

  const generatorHref = buildLocalePath(currentLocale, '/generator');
  const promptsHref = buildLocalePath(currentLocale, '/prompts');
  const homeHref = buildLocalePath(currentLocale, '/');
  const today = new Intl.DateTimeFormat(currentLocale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/30 to-white">
      <section className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-purple-50/30 to-pink-50/40" />
        <div className="relative mx-auto max-w-5xl text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {tHero('badge')}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {tHero('title')}
          </h1>
          <p className="mt-6 text-lg text-gray-600 sm:text-xl leading-relaxed">
            {tHero('subtitle')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700" asChild>
              <Link href={buildLocalePath(currentLocale, '/tutorial#workflow')}>{tHero('primaryCta')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={generatorHref}>{tHero('secondaryCta')}</Link>
            </Button>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            {tContent('updated', { date: today })}
          </div>
        </div>
      </section>

      <section id="workflow">
        <HowToTutorial />
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" variant="outline" asChild>
            <Link href={homeHref}>{tContent('ctaBack')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={promptsHref}>{tContent('ctaPrompts')}</Link>
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:from-purple-600 hover:to-blue-700" asChild>
            <Link href={generatorHref}>{tHero('secondaryCta')}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
