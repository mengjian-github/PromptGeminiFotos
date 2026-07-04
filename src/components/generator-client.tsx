'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ImageGenerator } from '@/components/image-generator';

type GeneratorClientProps = {
  userTier?: 'free' | 'pro';
};

type StoredPrompt = {
  prompt: string;
  source?: string;
  scenario?: string;
  templateId?: string;
};

export function GeneratorClient({ userTier = 'free' }: GeneratorClientProps) {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') ?? undefined;
  const [storedPrompt, setStoredPrompt] = useState<StoredPrompt | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem('promptgeminifotos.generatorPrefill');
      if (!raw) return;

      const parsed = JSON.parse(raw) as StoredPrompt;
      if (typeof parsed.prompt === 'string' && parsed.prompt.trim().length > 0) {
        setStoredPrompt(parsed);
      }
    } catch {
      // Ignore malformed or unavailable session storage.
    }
  }, []);

  return (
    <ImageGenerator
      userTier={userTier}
      initialTemplateId={templateId}
      initialPrompt={storedPrompt?.prompt}
      initialPromptMeta={storedPrompt ? {
        source: storedPrompt.source,
        scenario: storedPrompt.scenario,
        templateId: storedPrompt.templateId,
      } : undefined}
    />
  );
}
