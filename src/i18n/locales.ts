export const locales = ['pt-BR', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt-BR';

export const localeLabels: Record<Locale, string> = {
  'pt-BR': 'Português (BR)',
  'en': 'English'
};

export const localeMapping: Record<string, Locale> = {
  '': 'pt-BR',
  pt: 'pt-BR',
  'pt-br': 'pt-BR',
  'ptbr': 'pt-BR',
  br: 'pt-BR',
  en: 'en',
  'en-us': 'en',
  'en-gb': 'en',
  'en-au': 'en',
  'en-ca': 'en'
};
