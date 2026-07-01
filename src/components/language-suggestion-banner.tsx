'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { locales, localeLabels, type Locale } from '@/i18n/config';
import { buildLocalePath } from '@/lib/locale-path';

const DISMISSED_KEY = 'language-suggestion-dismissed';
const PREFERRED_LANG_KEY = 'preferredLang';

interface LanguageSuggestionBannerProps {
  currentLocale: Locale;
}

export function LanguageSuggestionBanner({ currentLocale }: LanguageSuggestionBannerProps) {
  const [show, setShow] = useState(false);
  const [suggestedLocale, setSuggestedLocale] = useState<Locale | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has already dismissed or set preference
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    const savedLang = localStorage.getItem(PREFERRED_LANG_KEY);

    if (dismissed || savedLang) {
      return;
    }

    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    let detectedLocale: Locale | null = null;

    // Match browser language to supported locales
    for (const locale of locales) {
      const localeLower = locale.toLowerCase();
      if (browserLang === localeLower || browserLang.startsWith(localeLower.split('-')[0])) {
        detectedLocale = locale;
        break;
      }
    }

    // Show banner if detected language differs from current
    if (detectedLocale && detectedLocale !== currentLocale) {
      setSuggestedLocale(detectedLocale);
      setShow(true);
    }
  }, [currentLocale]);

  const handleAccept = () => {
    if (!suggestedLocale) return;

    // Save preference
    localStorage.setItem(PREFERRED_LANG_KEY, suggestedLocale);

    // Get current path without locale prefix
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

    // Redirect to suggested locale
    window.location.href = buildLocalePath(suggestedLocale, pathWithoutLocale);
  };

  const handleDismiss = () => {
    // Save current locale as preference
    localStorage.setItem(PREFERRED_LANG_KEY, currentLocale);
    localStorage.setItem(DISMISSED_KEY, 'true');
    setShow(false);
  };

  if (!show || !suggestedLocale) {
    return null;
  }

  const messages = {
    'pt-BR': {
      text: `Parece que você prefere ${localeLabels[suggestedLocale]}. Deseja mudar?`,
      accept: 'Sim, mudar',
      dismiss: 'Não, continuar em Português'
    },
    'en': {
      text: `It looks like you prefer ${localeLabels[suggestedLocale]}. Switch language?`,
      accept: 'Yes, switch',
      dismiss: 'No, stay in English'
    }
  };

  const message = messages[currentLocale];

  return (
    <div className="relative z-30 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed sm:flex-1">
            {message.text}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAccept}
              className="min-h-10 rounded-lg bg-white px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              {message.accept}
            </button>
            <button
              onClick={handleDismiss}
              className="min-h-10 rounded-lg bg-blue-700/50 px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-700"
            >
              {message.dismiss}
            </button>
            <button
              onClick={handleDismiss}
              className="min-h-10 min-w-10 rounded-lg p-2 transition-colors hover:bg-blue-700/50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
