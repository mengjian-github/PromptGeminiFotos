import { buildLocalePath } from '@/lib/locale-path';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ImageGenerator } from '@/components/image-generator';
import { EnhancedCTA } from '@/components/enhanced-cta';
import { EnhancedFeatures } from '@/components/enhanced-features';
import { PromptCopyCards } from '@/components/prompt-copy-cards';
import { MobileStickyComposer } from '@/components/mobile-sticky-composer';
import { Metadata } from 'next';
import { generateBreadcrumbStructuredData, generateLocalizedAlternates } from '@/lib/seo';
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
    ? 'Prompt Gemini Fotos para Copiar'
    : 'Copy Gemini Photo Prompts';

  const description = locale === 'pt-BR'
    ? 'Copie prompts Gemini para LinkedIn, CV, ensaio feminino e casal. Use no Gemini ou teste templates no gerador com privacidade clara.'
    : 'Copy Gemini photo prompts for LinkedIn, CV, portraits and couples. Use them in Gemini or test templates in the generator with clear privacy notes.';

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: generateLocalizedAlternates(currentLocale, '/'),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  const isPortuguese = currentLocale === 'pt-BR';

  // Enable static rendering
  setRequestLocale(currentLocale);

  const t = await getTranslations();

  const userTier: "free" | "pro" = "free";

  const promptsHref = buildLocalePath(currentLocale, '/prompts');
  const generatorHref = buildLocalePath(currentLocale, '/generator');
  const templatesHref = buildLocalePath(currentLocale, '/templates');
  const tutorialHref = buildLocalePath(currentLocale, '/tutorial');
  const pageFaqs = isPortuguese
    ? [
        {
          question: 'Qual prompt Gemini usar para ensaio fotográfico feminino?',
          answer: 'Comece por um prompt que preserve identidade, defina luz softbox ou golden hour, lente 85mm, pose e finalidade da foto. O guia de prompts traz exemplos prontos para LinkedIn, editorial e redes sociais.',
        },
        {
          question: 'O Prompt Gemini Fotos gera a imagem dentro do site?',
          answer: 'Não. O fluxo público compõe e organiza texto de prompt. Você copia o resultado e abre o Gemini explicitamente para gerar a imagem com sua própria conta.',
        },
        {
          question: 'Como medir se o prompt funcionou?',
          answer: 'Compare identidade preservada, naturalidade da pele, luz, enquadramento e aderência ao objetivo. Se a primeira tentativa ficar genérica, ajuste cenário, lente e restrições no compositor.',
        },
      ]
    : [
        {
          question: 'Which Gemini prompt should I use for a female photoshoot?',
          answer: 'Start with an identity-preserving prompt that specifies softbox or golden-hour light, 85mm lens, pose, and the final use case. The prompt guide includes copy-ready LinkedIn, editorial, and social examples.',
        },
        {
          question: 'Does Prompt Gemini Photos generate the image on this site?',
          answer: 'No. The public workflow composes prompt text. You copy the result and explicitly open Gemini to generate the image with your own account.',
        },
        {
          question: 'How do I know whether the prompt worked?',
          answer: 'Check identity preservation, natural skin, lighting, framing, and fit for the final use case. If the first attempt is generic, tune scene, lens, and constraints in the composer.',
        },
        ];
        const homepageStructuredData = [
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: pageFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: isPortuguese ? 'Como usar Prompt Gemini Fotos' : 'How to use Prompt Gemini Photos',
          description: isPortuguese
            ? 'Escolha um cenário, copie ou ajuste o prompt, revise a identidade e abra o Gemini apenas quando quiser gerar a imagem.'
            : 'Choose a scenario, copy or tune the prompt, review identity constraints, and open Gemini only when you want to generate the image.',
          step: (isPortuguese
            ? ['Escolha LinkedIn/CV, ensaio feminino, casal ou retrato profissional.', 'Copie um prompt pronto ou ajuste no compositor com foto de referência local.', 'Abra o Gemini explicitamente, cole o prompt e compare o resultado com a intenção original.']
            : ['Choose LinkedIn/CV, female portrait, couple, or professional headshot.', 'Copy a ready prompt or tune it in the composer with a local reference photo.', 'Open Gemini explicitly, paste the prompt, and compare the result with the original intent.']
          ).map((text, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            text,
          })),
        },
        generateBreadcrumbStructuredData([
          { name: isPortuguese ? 'Início' : 'Home', url: buildLocalePath(currentLocale, '/', { absolute: true }) },
        ]),
        ];

        return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {homepageStructuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <MobileStickyComposer locale={currentLocale} />
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

          <section id="generator-section" className="mt-10 text-left scroll-mt-24">
            <div className="mb-5 text-center">
              <Badge variant="secondary" className="mb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {t('generator.tryNow')}
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {t('generator.tryGenerator')}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
                {t('generator.generatorDesc')}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-100/40 via-purple-100/40 to-pink-100/40 blur-3xl -z-10" />
              <ImageGenerator userTier={userTier} />
            </div>
          </section>

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

      <section id="search-intent-map" className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50/40">
        <div className="mx-auto max-w-6xl">
          <Badge variant="outline" className="mb-4 border-purple-200 bg-purple-50 text-purple-700">
            {isPortuguese ? 'Mapa de intenção' : 'Search intent map'}
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                {isPortuguese
                  ? 'Do termo de busca ao prompt pronto para o Gemini'
                  : 'From search query to a copy-ready Gemini prompt'}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                {isPortuguese
                  ? 'As buscas brasileiras ainda são pequenas, mas já mostram intenção clara: foto profissional, ensaio feminino, casal e aniversário. Esta seção liga cada consulta ao próximo passo certo para reduzir quick backs e aumentar cópias de prompt.'
                  : 'Early search data is small, but intent is clear: professional photos, female portraits, couples, and birthday sessions. This section maps each query to the right next step to reduce quick backs and increase prompt copies.'}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={promptsHref}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  {isPortuguese ? 'Ler guia de prompts' : 'Read prompt guide'}
                </Link>
                <Link
                  href={templatesHref}
                  className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  {isPortuguese ? 'Explorar templates' : 'Explore templates'}
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  query: isPortuguese ? 'prompt gemini ensaio fotográfico feminino' : 'Gemini female photoshoot prompt',
                  action: isPortuguese ? 'Copiar exemplo com identidade preservada' : 'Copy an identity-preserving example',
                  href: `${promptsHref}#ensaio-feminino`,
                },
                {
                  query: isPortuguese ? 'prompt gemini foto profissional' : 'Gemini professional headshot prompt',
                  action: isPortuguese ? 'Abrir compositor para LinkedIn/CV' : 'Open composer for LinkedIn/CV',
                  href: isPortuguese ? `${buildLocalePath(currentLocale, '/blog/prompt-gemini-foto-profissional-feminina')}` : `${generatorHref}?template=professional-linkedin-1`,
                },
                {
                  query: isPortuguese ? 'prompt gemini linkedin currículo' : 'Gemini LinkedIn CV prompt',
                  action: isPortuguese ? 'Ver fluxo LinkedIn/CV com prompt pronto' : 'Use the professional prompt workflow',
                  href: isPortuguese ? `${buildLocalePath(currentLocale, '/blog/prompt-gemini-linkedin-cv')}` : `${generatorHref}?template=professional-linkedin-1`,
                },
                {
                  query: isPortuguese ? 'prompt gemini ensaio fotográfico casal' : 'Gemini couple photoshoot prompt',
                  action: isPortuguese ? 'Ver roteiro de casal e pre-wedding' : 'View couple and pre-wedding workflow',
                  href: `${promptsHref}#ensaio-casal`,
                },
                {
                  query: isPortuguese ? 'prompt gemini fotos família' : 'Gemini family photo prompt',
                  action: isPortuguese ? 'Abrir guia família e gestante' : 'Open the family workflow',
                  href: isPortuguese ? `${buildLocalePath(currentLocale, '/blog/prompt-gemini-fotos-familia')}` : `${promptsHref}#ensaio-familia`,
                },
                {
                  query: isPortuguese ? 'como usar prompts no Gemini' : 'how to use prompts in Gemini',
                  action: isPortuguese ? 'Seguir tutorial passo a passo' : 'Follow the step-by-step tutorial',
                  href: tutorialHref,
                },
              ].map((item) => (
                <Link
                  key={item.query}
                  href={item.href}
                  className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">{item.query}</p>
                  <p className="mt-3 text-base font-semibold text-gray-950 group-hover:text-blue-700">{item.action}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {isPortuguese ? 'Abrir caminho recomendado →' : 'Open recommended path →'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
