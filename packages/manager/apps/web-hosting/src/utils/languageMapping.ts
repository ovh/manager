/**
 * Mapping of language codes to their display names
 * Based on ISO 639-1 language codes
 */
export const LANGUAGE_CODE_TO_NAME: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pl: 'Polski',
  fi: 'Suomi',
  it: 'Italiano',
  nl: 'Nederlands',
  pt: 'Português',
  cz: 'Čeština',
  lt: 'Lietuvių',
};

/**
 * Get the display name for a language code
 * @param langCode - ISO 639-1 language code (e.g., 'en', 'fr')
 * @returns Display name of the language or the code itself if not found
 */
export const getLanguageName = (langCode: string): string => {
  return LANGUAGE_CODE_TO_NAME[langCode.toLowerCase()] || langCode.toUpperCase();
};
