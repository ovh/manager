/**
 * Extracts the language code from a locale string.
 * Converts locale format (e.g., 'fr_FR') to language code (e.g., 'fr').
 *
 * @param {string} locale - The locale string in format 'll_RR' or 'll-RR'.
 * @returns {string} - The language code (e.g., 'fr', 'en', 'de').
 *
 * @example
 * extractLanguageCode('fr_FR') // returns 'fr'
 * extractLanguageCode('en_GB') // returns 'en'
 * extractLanguageCode('de-DE') // returns 'de'
 */
export const extractLanguageCode = (locale: string): string => {
  return locale.split(/[-_]/)[0].toLowerCase();
};
