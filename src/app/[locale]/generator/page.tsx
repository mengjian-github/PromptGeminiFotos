import { buildLocalePath } from "@/lib/locale-path";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ImageGenerator } from "@/components/image-generator";
import type { Locale } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ template?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  const keywords = locale === "pt-BR"
    ? [
        "gerador de fotos ia",
        "foto profissional ia",
        "prompt gemini retrato",
        "ensaio fotográfico ia",
        "prompt para gemini",
        "fotos linkedin ia"
      ]
    : [
        "ai photo generator",
        "professional ai portraits",
        "gemini photo prompts",
        "headshot ai generator",
        "linkedin photo ai",
        "ai photography"
      ];

  const title = locale === "pt-BR"
    ? "Prompt Gemini Fotos - Gerador de Fotos Profissionais com IA"
    : "Prompt Gemini Photos - Professional AI Photo Generator";

  const description = locale === "pt-BR"
    ? "Transforme fotos comuns em retratos profissionais usando prompts otimizados para Gemini. Gere imagens em segundos com qualidade de estúdio."
    : "Turn ordinary photos into professional portraits using Gemini-optimized prompts. Generate studio-grade images in seconds.";

  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: buildLocalePath(currentLocale, "/generator")
    }
  };
}

export default async function GeneratorPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  const templateParam = Array.isArray(query.template) ? query.template[0] : query.template;
  setRequestLocale(locale);

  const localized = locale === "pt-BR"
    ? {
        badge: "Gerador AI instantaneo",
        title: "Crie retratos profissionais com IA",
        subtitle: "Combine templates refinados com prompts inteligentes e gere resultados prontos para redes sociais, currículo ou portfólio.",
        stats: [
          { label: "Tempo médio", value: "10s" },
          { label: "Templates", value: "100" },
          { label: "Qualidade", value: "HD" },
          { label: "Testes grátis", value: "5" }
        ],
        generatorTitle: "Experimente agora",
        generatorSubtitle: "Envie uma referência ou escreva um prompt detalhado para criar seu próximo retrato profissional."
      }
    : {
        badge: "Instant AI generator",
        title: "Create professional portraits with AI",
        subtitle: "Mix polished templates with smart prompts and deliver results ready for social, resumes or portfolios.",
        stats: [
          { label: "Avg. time", value: "10s" },
          { label: "Templates", value: "100" },
          { label: "Quality", value: "HD" },
          { label: "Free runs", value: "5" }
        ],
        generatorTitle: "Try it now",
        generatorSubtitle: "Upload a reference or craft a detailed prompt to create your next professional portrait."
      };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-white">
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
            <ImageGenerator userTier="free" initialTemplateId={templateParam} />
          </div>
        </div>
      </section>
    </div>
  );
}

