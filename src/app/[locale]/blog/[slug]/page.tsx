import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { buildLocalePath } from '@/lib/locale-path';
import type { Locale } from '@/i18n/config';
import {
  getAllBlogSlugs,
  getPostBySlug,
  type BlogPost,
} from '@/data/blog-posts';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllBlogSlugs().map(({ locale, slug }) => ({ locale, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale as Locale, slug);

  if (!post) {
    return {
      title: 'Artigo - Prompt Gemini Fotos',
    };
  }

  const canonical = buildLocalePath(locale as Locale, `/blog/${post.slug}`, { absolute: true });
  return {
    title: post.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description: post.seo.description,
      url: canonical,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.seo.description,
    },
  };
}

function ArticleStructuredData({ post, locale }: { post: BlogPost; locale: Locale }) {
  const canonical = buildLocalePath(locale, `/blog/${post.slug}`, { absolute: true });
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Prompt Gemini Fotos',
    },
    mainEntityOfPage: canonical,
    keywords: post.seo.keywords,
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: buildLocalePath(locale, '/', { absolute: true }),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: buildLocalePath(locale, '/blog', { absolute: true }),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const currentLocale = locale as Locale;
  setRequestLocale(currentLocale);

  const post = getPostBySlug(currentLocale, slug);
  if (!post) {
    notFound();
  }

  const formatDate = new Intl.DateTimeFormat(currentLocale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const timeToRead = `${post.readingTimeMinutes} min`;
  const backToBlogHref = buildLocalePath(currentLocale, '/blog');

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/20 to-white">
      <ArticleStructuredData post={post} locale={currentLocale} />
      <section className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-purple-50/30 to-pink-50/40" />
        <div className="relative mx-auto max-w-4xl">
          <Link
            href={backToBlogHref}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <span aria-hidden className="mr-2">{'<-'} </span>{currentLocale === 'pt-BR' ? 'Voltar para o blog' : 'Back to blog'}
          </Link>
          <Badge variant="secondary" className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {post.heroEyebrow}
          </Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            {post.heroDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>{formatDate.format(new Date(post.publishedAt))}</span>
            <span>|</span>
            <span>{timeToRead}</span>
            <span>|</span>
            <span>{post.author}</span>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl grid gap-10">
          <Card className="border border-blue-100 bg-white/90">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentLocale === 'pt-BR' ? 'Resumo executivo' : 'Executive summary'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {post.takeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-12">
            {post.sections.map((section) => (
              <article key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {section.promptExamples && (
                  <div className="mt-6 space-y-6">
                    {section.promptExamples.map((example) => (
                      <Card key={example.title} className="border border-gray-200">
                        <CardContent className="p-5 space-y-3">
                          <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
                          <p className="text-sm text-gray-600">{example.description}</p>
                          <pre className="whitespace-pre-wrap bg-gray-900 text-gray-100 rounded-lg p-4 text-sm">
                            {example.prompt}
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <Card className="border border-gray-200 bg-white/90">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentLocale === 'pt-BR' ? 'Perguntas frequentes' : 'Frequently asked questions'}
              </h2>
              <div className="space-y-4">
                {post.faq.map((item) => (
                  <div key={item.question}>
                    <h3 className="text-base font-semibold text-gray-900">{item.question}</h3>
                    <p className="mt-2 text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            {post.ctas.map((cta) => (
              <Button
                key={cta.label}
                asChild
                size="lg"
                className={cta.variant === 'primary'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700'
                  : ''}
                variant={cta.variant === 'primary' ? 'default' : 'outline'}
              >
                <Link href={buildLocalePath(currentLocale, cta.href)}>{cta.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
