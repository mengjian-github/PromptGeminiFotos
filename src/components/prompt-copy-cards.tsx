'use client';

import Link from 'next/link';
import { Copy, ExternalLink, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import type { Locale } from '@/i18n/config';
import { buildLocalePath } from '@/lib/locale-path';

type PromptCard = {
  id: string;
  title: string;
  intent: string;
  prompt: string;
  exampleHref: string;
};

const GEMINI_URL = 'https://gemini.google.com/app';

const cardsByLocale: Record<Locale, PromptCard[]> = {
  'pt-BR': [
    {
      id: 'linkedin-cv',
      title: 'LinkedIn / CV',
      intent: 'Headshot profissional pronto para currículo, LinkedIn e perfil corporativo.',
      exampleHref: '/prompts#ensaio-profissional',
      prompt:
        'Use minha foto enviada como referência de identidade. Crie um headshot profissional para LinkedIn/CV, preservando rosto, idade aparente, tom de pele e traços faciais. Fundo cinza claro de estúdio, blazer neutro, luz softbox frontal com preenchimento suave, lente 85mm, enquadramento ombros para cima, expressão confiante e natural, textura de pele realista, sem alterar identidade, sem aparência plástica.'
    },
    {
      id: 'ensaio-feminino',
      title: 'Ensaio feminino',
      intent: 'Retrato editorial suave para Instagram, portfólio e marca pessoal.',
      exampleHref: '/prompts#ensaio-feminino',
      prompt:
        'Use minha foto como base e mantenha a identidade facial. Transforme em ensaio feminino editorial com iluminação golden hour lateral, pele natural, cabelo com movimento leve, roupa elegante em tons neutros, fundo urbano desfocado, composição meio-corpo, lente 85mm f/1.8, clima sofisticado e realista. Preserve proporções, expressão e características do rosto; não crie outra pessoa.'
    },
    {
      id: 'casal',
      title: 'Casal / pre-wedding',
      intent: 'Cena romântica com conexão natural e visual cinematográfico.',
      exampleHref: '/prompts#ensaio-casal',
      prompt:
        'Use as fotos enviadas do casal como referência. Crie um ensaio pre-wedding cinematográfico na praia ao amanhecer, casal de mãos dadas, expressões naturais, roupas claras, vento leve, ondas suaves ao fundo, luz dourada difusa, lente 35mm, tons pastel, bokeh discreto. Preserve a identidade das duas pessoas, proporções reais e detalhes de cabelo/pele; evite rosto genérico.'
    }
  ],
  en: [
    {
      id: 'linkedin-cv',
      title: 'LinkedIn / CV',
      intent: 'A professional headshot prompt for resumes, LinkedIn, and business profiles.',
      exampleHref: '/prompts#professional-session',
      prompt:
        'Use my uploaded photo as the identity reference. Create a professional LinkedIn/CV headshot while preserving face shape, apparent age, skin tone, and facial features. Light gray studio background, neutral blazer, soft frontal key light with gentle fill, 85mm lens, shoulders-up crop, confident natural expression, realistic skin texture, no identity change, no plastic retouching.'
    },
    {
      id: 'female-portrait',
      title: 'Female portrait',
      intent: 'Soft editorial portrait for social media, portfolio, and personal branding.',
      exampleHref: '/prompts#female-session',
      prompt:
        'Use my photo as the base and preserve facial identity. Turn it into an editorial female portrait with warm golden-hour side light, natural skin, gentle hair movement, elegant neutral wardrobe, blurred urban background, half-body composition, 85mm f/1.8 lens, sophisticated realistic mood. Preserve facial proportions and expression; do not create a different person.'
    },
    {
      id: 'couple',
      title: 'Couple / pre-wedding',
      intent: 'A cinematic romantic scene with natural connection and realistic faces.',
      exampleHref: '/prompts#couple-session',
      prompt:
        'Use the uploaded couple photos as identity references. Create a cinematic pre-wedding beach photoshoot at sunrise: couple holding hands, natural expressions, light outfits, soft wind, gentle ocean in the background, diffused golden light, 35mm lens, pastel tones, subtle bokeh. Preserve both people’s identity, proportions, hair, and skin details; avoid generic faces.'
    }
  ]
};

export function PromptCopyCards({ locale }: { locale: Locale }) {
  const cards = cardsByLocale[locale] ?? cardsByLocale['pt-BR'];

  const copyPrompt = async (card: PromptCard) => {
    trackEvent('prompt_copy', {
      source: 'hero_prompt_card',
      template_id: card.id,
      prompt_length: card.prompt.length,
    });

    try {
      await navigator.clipboard.writeText(card.prompt);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const trackGemini = (card: PromptCard) => {
    trackEvent('gemini_outbound_click', {
      source: 'hero_prompt_card',
      template_id: card.id,
      destination: GEMINI_URL,
    });
  };

  const trackGenerator = (card: PromptCard) => {
    trackEvent('hero_cta_click', {
      source: 'hero_prompt_card',
      template_id: card.id,
      destination: 'on_site_generator',
    });
  };

  return (
    <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-4 text-left md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.id}
          className="flex min-h-[270px] flex-col rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-sm ring-1 ring-white/60 sm:p-5"
        >
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Copy-paste prompt
            </p>
            <h2 className="mt-1 text-xl font-bold text-gray-950">{card.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{card.intent}</p>
          </div>
          <p className="line-clamp-5 flex-1 rounded-xl bg-gray-50 p-3 text-sm leading-relaxed text-gray-800">
            {card.prompt}
          </p>
          <div className="mt-4 grid gap-2">
            <Button
              type="button"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => copyPrompt(card)}
            >
              <Copy className="mr-2 h-4 w-4" />
              {locale === 'pt-BR' ? 'Copiar prompt' : 'Copy prompt'}
            </Button>
            <Button type="button" className="w-full bg-purple-600 text-white hover:bg-purple-700" asChild>
              <Link href={buildLocalePath(locale, `/generator?template=${encodeURIComponent(card.id)}`)} onClick={() => trackGenerator(card)}>
                <Sparkles className="mr-2 h-4 w-4" />
                {locale === 'pt-BR' ? 'Usar no gerador' : 'Use in generator'}
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" asChild>
                <a href={GEMINI_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackGemini(card)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Gemini
                </a>
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={buildLocalePath(locale, card.exampleHref)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {locale === 'pt-BR' ? 'Exemplo' : 'Example'}
                </Link>
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
