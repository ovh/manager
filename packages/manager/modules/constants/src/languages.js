/**
 * Languages available in the Manager
 *
 * @typedef   {object}    Language
 * @property  {string}    displayName   - Name of the language in this language
 * @property  {boolean}   isFallback    - When you can't find a translation in the current language,
 * should you search in that language instead?
 * @property  {string}    locale        - BCP 47 language tag
 * @property  {string}    name          - OVH name of the language
 */
export default {
  de_DE: {
    displayName: 'Deutsch',
    locale: 'de-DE',
    name: 'de_DE',
  },
  en_GB: {
    displayName: 'English',
    locale: 'en-GB',
    name: 'en_GB',
  },
  es_ES: {
    displayName: 'Español',
    locale: 'es-ES',
    name: 'es_ES',
  },
  fi_FI: {
    displayName: 'Suomi',
    locale: 'fi-FI',
    name: 'fi_FI',
  },
  fr_CA: {
    displayName: 'Français (Canadien)',
    locale: 'fr-CA',
    name: 'fr_CA',
  },
  fr_FR: {
    displayName: 'Français',
    isFallback: true,
    locale: 'fr-FR',
    name: 'fr_FR',
  },
  it_IT: {
    displayName: 'Italiano',
    locale: 'it-IT',
    name: 'it_IT',
  },
  lt_LT: {
    displayName: 'Lietuviškai',
    locale: 'lt-LT',
    name: 'lt_LT',
  },
  pl_PL: {
    displayName: 'Polski',
    locale: 'pl-PL',
    name: 'pl_PL',
  },
  pt_PT: {
    displayName: 'Português',
    locale: 'pt-PT',
    name: 'pt_PT',
  },
};
