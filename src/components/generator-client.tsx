'use client';

import { useSearchParams } from 'next/navigation';
import { ImageGenerator } from '@/components/image-generator';

type GeneratorClientProps = {
  userTier?: 'free' | 'pro';
};

export function GeneratorClient({ userTier = 'free' }: GeneratorClientProps) {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') ?? undefined;

  return <ImageGenerator userTier={userTier} initialTemplateId={templateId} />;
}
