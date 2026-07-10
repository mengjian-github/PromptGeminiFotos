import { Suspense } from "react";
import { buildLocalePath } from "@/lib/locale-path";
import { generateBreadcrumbStructuredData, generateLocalizedAlternates } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { GeneratorClient } from "@/components/generator-client";
import type { Locale } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  const keywords = locale === "pt-BR"
    ? [
        "compositor de prompts Gemini",
        "foto profissional ia",
        "prompt gemini retrato",
        "ensaio fotográfico ia",
        "prompt para gemini",
        "fotos linkedin ia"
      ]
    : [
        "Gemini prompt composer",
        "professional ai portraits",
        "gemini photo prompts",
        "headshot ai generator",
        "linkedin photo ai",
        "ai photography"
      ];

  const title = locale === "pt-BR"
    ? "Compositor Prompt Gemini Fotos"
    : "Gemini Photo Prompt Composer";

  const description = locale === "pt-BR"
    ? "Ajuste prompts otimizados para Gemini, copie o texto final e use com sua foto no Gemini com controle claro de identidade e luz."
    : "Tune Gemini-optimized photo prompts, copy the final text, and use it with your photo in Gemini with clear control over identity and lighting.";

  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: generateLocalizedAlternates(currentLocale, "/generator")
  };
}

export default async function GeneratorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const currentLocale = locale as Locale;

  const userTier: "free" | "pro" = "free";

  const localized = locale === "pt-BR"
    ? {
        badge: "Compositor de prompts",
        title: "Monte prompts Gemini prontos para copiar",
        subtitle: "Combine templates refinados, sua referência e instruções de identidade antes de abrir o Gemini.",
        answerTitle: "Resposta rápida: como usar Prompt Gemini Fotos",
        answerBody: "Escolha um cenário, cole ou ajuste o prompt, envie uma foto de referência apenas se quiser preservar identidade e copie o texto final para abrir no Gemini. O fluxo público prepara prompts; não promete geração ilimitada nem envia sua imagem automaticamente para terceiros.",
        steps: [
          "Selecione um template de LinkedIn, ensaio feminino, casal ou retrato profissional.",
          "Personalize identidade, luz, lente, cenário e idioma antes de gerar o prompt final.",
          "Copie, baixe em TXT ou abra o Gemini explicitamente para colar o resultado."
        ],
        faqs: [
          ["O gerador cria a imagem dentro do site?", "Não. Ele compõe um prompt Gemini pronto para copiar; a abertura do Gemini acontece somente quando você clica no botão externo."],
          ["A foto de referência sai do navegador?", "No fluxo público atual, a prévia local fica no navegador para ajudar você a escrever o prompt. Se uma API externa for usada futuramente, isso será avisado antes do upload."],
          ["Qual prompt começar para foto profissional?", "Use um template de LinkedIn/CV com fundo neutro, lente 85mm, luz softbox e instrução explícita para preservar identidade."]
        ],
        stats: [
          { label: "Tempo médio", value: "<1 min" },
          { label: "Templates", value: "100" },
          { label: "Saída", value: "TXT" },
          { label: "Fluxo", value: "Gemini" }
        ],
        generatorTitle: "Componha o prompt agora",
        generatorSubtitle: "Envie uma referência local ou escreva um briefing; o resultado é um prompt final para copiar, baixar em TXT ou abrir no Gemini."
      }
    : {
        badge: "Prompt composer",
        title: "Build copy-ready Gemini photo prompts",
        subtitle: "Mix polished templates, your reference, and identity-safe instructions before opening Gemini.",
        answerTitle: "Quick answer: how to use Prompt Gemini Photos",
        answerBody: "Choose a scenario, paste or tune the prompt, add a reference photo only when identity preservation matters, then copy the final text into Gemini. The public flow prepares prompts; it does not promise unlimited image generation or upload your photo automatically.",
        steps: [
          "Select a LinkedIn, female portrait, couple, or professional headshot template.",
          "Tune identity, lighting, lens, scene, and language before composing the final prompt.",
          "Copy, download as TXT, or explicitly open Gemini to paste the result."
        ],
        faqs: [
          ["Does this tool generate the image on-site?", "No. It composes a Gemini-ready prompt; Gemini opens only after you click the external button."],
          ["Does my reference photo leave the browser?", "In the current public flow, the local preview stays in the browser to help you write the prompt. Any future external API upload will be disclosed before sending."],
          ["Which prompt should I start with for a professional photo?", "Use a LinkedIn/CV template with a neutral background, 85mm lens, softbox lighting, and an explicit identity-preservation instruction."]
        ],
        stats: [
          { label: "Avg. time", value: "<1 min" },
          { label: "Templates", value: "100" },
          { label: "Output", value: "TXT" },
          { label: "Workflow", value: "Gemini" }
        ],
        generatorTitle: "Compose the prompt now",
        generatorSubtitle: "Add a local reference or write a brief; the result is a final prompt to copy, download as TXT, or open in Gemini."
      };
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: localized.faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
  const howToStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: localized.answerTitle,
    description: localized.answerBody,
    step: localized.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step,
    })),
  };
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: locale === 'pt-BR' ? 'Início' : 'Home', url: buildLocalePath(currentLocale, '/', { absolute: true }) },
    { name: locale === 'pt-BR' ? 'Gerador' : 'Generator', url: buildLocalePath(currentLocale, '/generator', { absolute: true }) },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <section className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-purple-50 opacity-60" />
        <div className="absolute top-20 left-12 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-12 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />

        <div className="relative mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-pulse">
            {localized.badge}
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {localized.title}
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl leading-relaxed mb-10">
            {localized.subtitle}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {localized.stats.map((item) => (
              <div key={item.label} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {item.value}
                </div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-5 rounded-3xl border border-blue-100 bg-white/85 p-6 shadow-sm md:grid-cols-[1.2fr,0.8fr] md:p-8">
          <div>
            <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700">
              {locale === "pt-BR" ? "Resposta direta" : "Answer first"}
            </Badge>
            <h2 className="text-2xl font-bold text-gray-900">{localized.answerTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">{localized.answerBody}</p>
          </div>
          <ol className="space-y-3 text-sm text-gray-700">
            {localized.steps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl bg-blue-50/70 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {localized.generatorTitle}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {localized.generatorSubtitle}
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 rounded-3xl blur-3xl -z-10" />
            <Suspense fallback={<div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">Loading composer…</div>}>
              <GeneratorClient userTier={userTier} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}

