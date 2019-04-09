export const LANGUAGES = [
  { value: 'de_DE', name: 'Deutsch' },
  { value: 'en_GB', name: 'English' },
  { value: 'en_CA', name: 'English (Canadian)' },
  { value: 'en_US', name: 'English (United States)' },
  { value: 'en_AU', name: 'English (Australia)' },
  { value: 'en_ASIA', name: 'English (Asia)' },
  { value: 'en_SG', name: 'English (Singapore)' },
  { value: 'es_ES', name: 'Español' },
  { value: 'fr_FR', name: 'Français' },
  { value: 'fr_CA', name: 'Français (Canadien)' },
  { value: 'it_IT', name: 'Italiano' },
  { value: 'lt_LT', name: 'Lietuviškai' },
  { value: 'nl_NL', name: 'Nederlands' },
  { value: 'pl_PL', name: 'Polski' },
  { value: 'pt_PT', name: 'Português' },
  { value: 'sk_SK', name: 'Slovakian' },
  { value: 'fi_FI', name: 'Suomi' },
  { value: 'cs_CZ', name: 'Česky' },
];

export const LANG_PATTERN = /^[a-z]{2}_[A-Z]{2,4}$/;

export default {
  LANG_PATTERN,
  LANGUAGES,
};
