export const LANGUAGES = {
  available: [
    {
      name: 'Deutsch',
      key: 'de_DE',
    },
    {
      name: 'English',
      key: 'en_GB',
    },
    {
      name: 'Español',
      key: 'es_ES',
    },
    {
      name: 'Français',
      key: 'fr_FR',
    },
    {
      name: 'Français (Canadien)',
      key: 'fr_CA',
    },
    {
      name: 'Italiano',
      key: 'it_IT',
    },
    {
      name: 'Polski',
      key: 'pl_PL',
    },
    {
      name: 'Português',
      key: 'pt_PT',
    },
  ],
  defaultLoc: 'fr_FR',
  fallback: 'fr_FR',
  preferred: {
    en: {
      US: 'GB',
      CA: 'GB',
      EU: 'GB',
    },
    fr: {
      US: 'CA',
      CA: 'CA',
      EU: 'FR',
    },
  },
};
export const localeStorageKey = 'univers-selected-language';
export const localeRegex = /^([a-zA-Z]+)(?:[_-]([a-zA-Z]+))?$/;
