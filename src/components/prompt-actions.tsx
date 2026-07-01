'use client';

import Link from 'next/link';
import { Copy, ExternalLink, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

const GEMINI_URL = 'https://gemini.google.com/app';

type PromptActionsProps = {
  prompt: string;
  locale: string;
  source: string;
  scenario: string;
  templateId: string;
  generatorHref: string;
};

export function PromptActions({ prompt, locale, source, scenario, templateId, generatorHref }: PromptActionsProps) {
  const isPortuguese = locale === 'pt-BR';

  const analyticsProps = {
    source,
    scenario,
    template_id: templateId,
    prompt_length: prompt.length,
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    trackEvent('prompt_copy', analyticsProps);
  };

  const trackGemini = () => {
    trackEvent('gemini_outbound_click', {
      ...analyticsProps,
      destination: GEMINI_URL,
    });
  };

  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-3">
      <Button type="button" size="sm" className="bg-blue-600 text-white hover:bg-blue-700" onClick={copyPrompt}>
        <Copy className="mr-2 h-4 w-4" />
        {isPortuguese ? 'Copiar prompt' : 'Copy prompt'}
      </Button>
      <Button type="button" size="sm" variant="outline" asChild>
        <a href={GEMINI_URL} target="_blank" rel="noopener noreferrer" onClick={trackGemini}>
          <ExternalLink className="mr-2 h-4 w-4" />
          {isPortuguese ? 'Abrir Gemini' : 'Open Gemini'}
        </a>
      </Button>
      <Button type="button" size="sm" variant="outline" asChild>
        <Link href={generatorHref} onClick={() => trackEvent('template_select', analyticsProps)}>
          <WandSparkles className="mr-2 h-4 w-4" />
          {isPortuguese ? 'Usar no gerador' : 'Use in generator'}
        </Link>
      </Button>
    </div>
  );
}
