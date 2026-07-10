import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildLocalePath } from "@/lib/locale-path";
import { generateLocalizedAlternates } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isPortuguese = locale === "pt-BR";

  return {
    title: isPortuguese ? "Status do fluxo de prompts" : "Prompt workflow status",
    description: isPortuguese
      ? "O fluxo público atual é gratuito e focado em prompts Gemini prontos para copiar. Não há checkout ativo."
      : "The current public workflow is free and focused on copy-ready Gemini prompts. No checkout is active.",
    robots: {
      index: false,
      follow: true,
    },
    alternates: generateLocalizedAlternates(locale as Locale, "/pricing"),
  };
}

export default async function PricingStatusPage({ params }: Props) {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  setRequestLocale(currentLocale);

  const isPortuguese = currentLocale === "pt-BR";
  const homeHref = buildLocalePath(currentLocale, "/#generator-section");
  const promptsHref = buildLocalePath(currentLocale, "/prompts");
  const contactHref = buildLocalePath(currentLocale, "/contact");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-4 py-24 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-xl shadow-blue-100/50 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {isPortuguese ? "Status comercial" : "Commercial status"}
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {isPortuguese ? "Fluxo gratuito, prompt-first" : "Free, prompt-first workflow"}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          {isPortuguese
            ? "Prompt Gemini Fotos não tem checkout, plano Pro ou cobrança ativa neste momento. A experiência pública ajuda você a escolher, compor, copiar e abrir prompts no Gemini de forma explícita."
            : "Prompt Gemini Photos has no active checkout, Pro plan, or paid billing right now. The public experience helps you choose, compose, copy, and explicitly open prompts in Gemini."}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            isPortuguese
              ? ["Sem cobrança", "Nenhum pagamento, cartão ou assinatura é solicitado no fluxo público."]
              : ["No billing", "No payment, card, or subscription is requested in the public workflow."],
            isPortuguese
              ? ["Prompt pronto", "Copie o texto final ou exporte TXT antes de abrir o Gemini."]
              : ["Copy-ready prompt", "Copy the final text or export TXT before opening Gemini."],
            isPortuguese
              ? ["Privacidade clara", "Fotos de referência ficam locais até você escolher uma próxima etapa externa."]
              : ["Clear privacy", "Reference photos stay local until you choose an external next step."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-base font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-purple-700"
          >
            {isPortuguese ? "Compor prompt agora" : "Compose a prompt now"}
          </Link>
          <Link
            href={promptsHref}
            className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            {isPortuguese ? "Ver guia de prompts" : "View prompt guide"}
          </Link>
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {isPortuguese ? "Falar com suporte" : "Contact support"}
          </Link>
        </div>
      </section>
    </div>
  );
}
