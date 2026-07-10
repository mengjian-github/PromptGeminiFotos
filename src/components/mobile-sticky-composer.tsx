'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { buildLocalePath } from '@/lib/locale-path';
import type { Locale } from '@/i18n/config';

export function MobileStickyComposer({ locale }: { locale: Locale }) {
  const href = buildLocalePath(locale, '/#generator-section');
  const label = locale === 'pt-BR' ? 'Compor prompt' : 'Compose prompt';
  const note = locale === 'pt-BR' ? 'Gerador grátis no site' : 'Free on-site composer';

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
      <Link
        href={href}
        onClick={() => trackEvent('hero_cta_click', { source: 'mobile_sticky_composer', target: 'generator-section' })}
        className="flex min-h-14 items-center justify-between rounded-2xl border border-white/60 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-2xl shadow-blue-900/25 backdrop-blur"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-bold">{label}</span>
            <span className="block text-xs text-blue-100">{note}</span>
          </span>
        </span>
        <span className="text-lg" aria-hidden>→</span>
      </Link>
    </div>
  );
}
