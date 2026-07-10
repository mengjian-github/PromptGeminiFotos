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
    title: isPortuguese ? 'Termos de Uso' : 'Terms of Use',
    description: isPortuguese
      ? 'Termos do fluxo gratuito do Prompt Gemini Fotos: prompts para copiar, abertura explícita do Gemini, uso aceitável e limitações.'
      : 'Terms for the free Prompt Gemini Photos workflow: copy-ready prompts, explicit Gemini handoff, acceptable use, and limitations.',
    alternates: generateLocalizedAlternates(currentLocale, '/terms'),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');
  const currentLocale = locale as Locale;
  const isPortuguese = currentLocale === 'pt-BR';
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: isPortuguese ? 'Início' : 'Home', url: buildLocalePath(currentLocale, '/', { absolute: true }) },
    { name: isPortuguese ? 'Termos' : 'Terms', url: buildLocalePath(currentLocale, '/terms', { absolute: true }) },
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
                {t('agreement.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('agreement.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('license.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('license.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {t.raw('license.restrictions').map((restriction: string, index: number) => (
                  <li key={index}>{restriction}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('aiContent.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('aiContent.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('liability.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('liability.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('contact.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('contact.content')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
