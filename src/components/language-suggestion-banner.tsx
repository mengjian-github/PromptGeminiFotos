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
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm sm:text-base flex-1">
            {message.text}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              {message.accept}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-blue-700/50 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              {message.dismiss}
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-blue-700/50 rounded-lg transition-colors"
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
