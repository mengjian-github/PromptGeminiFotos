import { buildLocalePath } from '@/lib/locale-path';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ImageGenerator } from '@/components/image-generator';
import { EnhancedCTA } from '@/components/enhanced-cta';
import { EnhancedFeatures } from '@/components/enhanced-features';
import { PromptCopyCards } from '@/components/prompt-copy-cards';
import { Metadata } from 'next';
import type { Locale } from '@/i18n/config';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  const keywords = locale === 'pt-BR' ? [
    'prompt gemini ensaio fotografico',
    'prompt gemini foto profissional',
    'prompt gemini casal',
    'copiar prompt Gemini fotos',
    'inteligencia artificial fotografia',
    'prompt fotografia gemini',
    'ensaio fotografico AI',
    'foto profissional AI',
    'prompt para gemini',
    'fotografia artificial',
    'gemini prompts fotos',
    'AI photography generator'
  ] : [
    'copy Gemini photo prompts',
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
    ? 'Prompt Gemini Fotos para Copiar - LinkedIn, Feminino e Casal'
    : 'Copy Gemini Photo Prompts - LinkedIn, Portraits and Couples';

  const description = locale === 'pt-BR'
    ? 'Copie prompts Gemini para LinkedIn, CV, ensaio feminino e casal. Use no Gemini ou teste templates no gerador com privacidade clara.'
    : 'Copy Gemini photo prompts for LinkedIn, CV, portraits and couples. Use them in Gemini or test templates in the generator with clear privacy notes.';

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: buildLocalePath(currentLocale, '/', { absolute: true }),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  // Enable static rendering
  setRequestLocale(currentLocale);

  const t = await getTranslations();

  const userTier: "free" | "pro" = "free";

  const promptsHref = buildLocalePath(currentLocale, '/prompts');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-14 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-purple-50 opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />

        <div className="relative mx-auto max-w-7xl text-center">
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {currentLocale === 'pt-BR' ? 'Prompts prontos para copiar' : 'Copy-paste prompts'}
          </Badge>

          <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600 sm:text-xl leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <PromptCopyCards locale={currentLocale} />

          <p className="mx-auto mt-5 max-w-3xl text-sm text-gray-500">
            {currentLocale === 'pt-BR'
              ? 'Primeiro copie o prompt e cole no Gemini com sua foto. Se quiser ajustar templates e salvar variações, use o gerador abaixo como CTA secundário.'
              : 'Copy a prompt first and paste it into Gemini with your photo. If you want template tuning and saved variations, use the generator below as the secondary CTA.'}
          </p>

          <EnhancedCTA
            primaryText={t('hero.cta')}
            secondaryText={t('hero.features')}
            freeGenerations={2}
          />

          {/* Keyword intent section */}
          <div className="mt-12 text-left">
            <Badge variant="outline" className="mb-4 border-blue-500 text-blue-600 bg-blue-50">
              {t('keywordSection.badge')}
            </Badge>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              {t('keywordSection.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              {t('keywordSection.intro')}
            </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {t('keywordSection.bullet')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a
                href="#generator-section"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-7 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:from-blue-600 hover:to-purple-700"
              >
                {t('keywordSection.cta')}
              </a>
              <Link
                href={promptsHref}
                className="inline-flex items-center justify-center rounded-lg border border-blue-200 px-7 py-3 text-base font-semibold text-blue-600 bg-white/80 hover:bg-blue-50 transition-colors duration-300"
              >
                {t('keywordSection.promptsGuide')}
              </Link>
            </div>
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

      <section id="ai-photo-handling" className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-5xl">
          <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 bg-blue-50">
            {currentLocale === 'pt-BR' ? 'Privacidade de fotos' : 'Photo handling'}
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900">
            {currentLocale === 'pt-BR' ? 'Como tratamos suas fotos e prompts' : 'How we handle your photos and prompts'}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              currentLocale === 'pt-BR'
                ? ['As fotos são enviadas para nossos servidores?', 'No fluxo público atual, a foto de referência fica no navegador para preparar prompts. Quando uma API externa for usada, o upload será indicado antes do envio.']
                : ['Are photos uploaded to our servers?', 'In the current public workflow, reference photos stay in the browser to prepare prompts. If an external API is used later, upload will be clearly indicated before sending.'],
              currentLocale === 'pt-BR'
                ? ['As imagens são usadas para treinamento?', 'Não treinamos modelos com suas fotos. Se você colar o prompt no Gemini, o uso da foto passa a seguir as configurações e termos da sua conta Google.']
                : ['Are images used for training?', 'We do not train models with your photos. If you paste the prompt into Gemini, photo handling follows your Google account settings and Google terms.'],
              currentLocale === 'pt-BR'
                ? ['Por quanto tempo os arquivos ficam salvos?', 'Uploads locais desaparecem ao limpar a sessão/navegador. Dados de suporte enviados por e-mail podem ser removidos sob solicitação.']
                : ['How long are files stored?', 'Local uploads disappear when the session/browser data is cleared. Support data sent by email can be deleted on request.'],
              currentLocale === 'pt-BR'
                ? ['O que acontece se a geração falhar?', 'Você ainda pode copiar o prompt e tentar novamente no Gemini. Falhas não criam cobrança automática nem prometem resultado ilimitado.']
                : ['What happens if generation fails?', 'You can still copy the prompt and retry in Gemini. Failures do not create automatic charges or imply unlimited output.'],
            ].map(([question, answer]) => (
              <div key={question} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="text-base font-semibold text-gray-900">{question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{answer}</p>
              </div>
            ))}
          </div>
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

            <ImageGenerator userTier={userTier} />
          </div>
        </div>
      </section>
    </div>
  );
}
