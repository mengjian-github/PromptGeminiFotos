import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { buildLocalePath } from '@/lib/locale-path';
import { generateBreadcrumbStructuredData, generateLocalizedAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  const isPortuguese = currentLocale === 'pt-BR';

  return {
    title: isPortuguese ? 'Política de Privacidade' : 'Privacy Policy',
    description: isPortuguese
      ? 'Como o Prompt Gemini Fotos trata prompts, fotos locais, cookies, analytics e solicitações de privacidade no fluxo público gratuito.'
      : 'How Prompt Gemini Photos handles prompts, local photos, cookies, analytics, and privacy requests in the free public workflow.',
    alternates: generateLocalizedAlternates(currentLocale, '/privacy'),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');
  const currentLocale = locale as Locale;
  const isPortuguese = currentLocale === 'pt-BR';
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: isPortuguese ? 'Início' : 'Home', url: buildLocalePath(currentLocale, '/', { absolute: true }) },
    { name: isPortuguese ? 'Privacidade' : 'Privacy', url: buildLocalePath(currentLocale, '/privacy', { absolute: true }) },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {t('title')}
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              {t('lastUpdated')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('infoCollect.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('infoCollect.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {t.raw('infoCollect.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('howUse.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('howUse.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {t.raw('howUse.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('photoProcessing.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('photoProcessing.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('security.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('security.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('rights.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('rights.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {t.raw('rights.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('thirdParty.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('thirdParty.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('contactUs.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('contactUs.content')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

