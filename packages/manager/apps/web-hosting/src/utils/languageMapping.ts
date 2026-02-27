import { LANGUAGES } from '@ovh-ux/manager-config';

const LANGUAGE_FALLBACK_MAP: Record<string, string> = {
  nl: 'Nederlands',
  fi: 'Suomi',
  cz: 'Čeština',
  lt: 'Lietuvių',
};

/**
 * Get the display name for a language code using OVH language constants
 * @param langCode - ISO 639-1 language code (e.g., 'en', 'fr')
 * @returns Display name of the language or the code itself if not found
 */
export const getLanguageName = (langCode: string): string => {
  const normalizedCode = langCode.toLowerCase();

  // Find language in LANGUAGES.available by matching the locale key prefix
  const language = LANGUAGES.available.find((lang) => {
    const localeCode = lang.key.split('_')[0]?.toLowerCase();
    return localeCode === normalizedCode;
  });

  if (language) {
    return language.name;
  }

  return LANGUAGE_FALLBACK_MAP[normalizedCode] || langCode.toUpperCase();
};
