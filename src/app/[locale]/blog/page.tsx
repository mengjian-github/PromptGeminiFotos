import Link from 'next/link';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { buildLocalePath } from '@/lib/locale-path';
import type { Locale } from '@/i18n/config';
import { getPostsByLocale } from '@/data/blog-posts';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blogPage.meta' });
  const keywords = t('keywords').split(',').map((keyword) => keyword.trim());
  const canonical = buildLocalePath(locale as Locale, '/blog', { absolute: true });

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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  setRequestLocale(currentLocale);

  const [t, tList] = await Promise.all([
    getTranslations('blogPage.hero'),
    getTranslations('blogPage.list'),
  ]);
  const posts = getPostsByLocale(currentLocale);
  const hasPosts = posts.length > 0;
  const formatDate = new Intl.DateTimeFormat(currentLocale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <section className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-purple-50/40 to-pink-50/40" />
        <div className="relative mx-auto max-w-5xl text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {t('badge')}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg text-gray-600 sm:text-xl leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700" asChild>
              <Link href={buildLocalePath(currentLocale, '/blog#posts')}>{t('primaryCta')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={buildLocalePath(currentLocale, '/prompts')}>{t('secondaryCta')}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="posts" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {hasPosts ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {tList('latest')}
                </h2>
                <span className="text-sm text-gray-500">
                  {tList('count', { count: posts.length })}
                </span>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {posts.map((post) => {
                  const href = buildLocalePath(currentLocale, `/blog/${post.slug}`);
                  const meta = `${formatDate.format(new Date(post.publishedAt))} - ${tList('readingTime', { minutes: post.readingTimeMinutes })}`;
                  return (
                    <Card key={post.slug} className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                          <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                            {post.category}
                          </Badge>
                          <span>{meta}</span>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-gray-600 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-auto pt-6">
                          <Link
                            href={href}
                            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                          >
                            {tList('readMore')}
                            <span className="ml-2" aria-hidden>
                              &rarr;
                            </span>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <Card className="border border-dashed border-blue-200 bg-white/80">
              <CardContent className="p-8 text-center space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {tList('empty.title')}
                </h3>
                <p className="text-gray-600">
                  {tList('empty.description')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
