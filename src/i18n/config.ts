import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale, defaultLocale } from './locales';

export { locales, defaultLocale, localeLabels, localeMapping } from './locales';
export type { Locale } from './locales';

type Messages = Record<string, unknown>;

function mergeMessages(base: Messages, overrides: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, value] of Object.entries(overrides)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof result[key] === 'object' &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = mergeMessages(result[key] as Messages, value as Messages);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = requested && locales.includes(requested as Locale)
    ? requested
    : defaultLocale;

  try {
    const messagesModule = await import(`./messages/${locale}.json`);
    let messages = messagesModule.default as Messages;

    if (locale !== defaultLocale) {
      const fallbackModule = await import(`./messages/${defaultLocale}.json`);
      messages = mergeMessages(fallbackModule.default as Messages, messages);
    }

    return {
      locale,
      messages
    };
  } catch (error) {
    console.error(`[i18n] failed to load messages for locale="${locale}"`, error);
    notFound();
  }
});
