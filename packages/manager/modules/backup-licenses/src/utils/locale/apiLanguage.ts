/**
 * Locales acceptées par le paramètre `language` des API v2 (`common.LanguageEnum`).
 * Une locale hors de cette liste ferait échouer la requête en 400.
 */
const API_LANGUAGES = new Set([
  'cs_CZ',
  'de_DE',
  'en_AS',
  'en_AU',
  'en_CA',
  'en_GB',
  'en_IE',
  'en_IN',
  'en_SG',
  'en_US',
  'en_WW',
  'es_ES',
  'es_SA',
  'fi_FI',
  'fr_CA',
  'fr_FR',
  'fr_MA',
  'fr_SN',
  'fr_TN',
  'it_IT',
  'lt_LT',
  'nl_NL',
  'pl_PL',
  'pt_PT',
]);

/** Convertit la locale i18next courante en `language` d'API, ou `undefined` si non supportée. */
export const toApiLanguage = (locale?: string): string | undefined => {
  const normalized = locale?.replace('-', '_');
  return normalized && API_LANGUAGES.has(normalized) ? normalized : undefined;
};
