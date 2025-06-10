import { OVHLanguages } from '../locale';
import { CountryCode } from '../locale/country-code.enum';

export const LANGUAGES: OVHLanguages = {
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
      US: CountryCode.GB,
      CA: CountryCode.GB,
      EU: CountryCode.GB,
    },
    fr: {
      US: CountryCode.CA,
      CA: CountryCode.CA,
      EU: CountryCode.FR,
    },
  },
};

export const localeStorageKey = 'univers-selected-language';
export const localeRegex = /^([a-zA-Z]+)(?:[_-]([a-zA-Z]+))?$/;

export type UserLocales =
  | 'cs_CZ'
  | 'de_DE'
  | 'en_AU'
  | 'en_CA'
  | 'en_GB'
  | 'en_IE'
  | 'en_US'
  | 'es_ES'
  | 'fi_FI'
  | 'fr_CA'
  | 'fr_FR'
  | 'fr_MA'
  | 'fr_SN'
  | 'fr_TN'
  | 'it_IT'
  | 'lt_LT'
  | 'nl_NL'
  | 'pl_PL'
  | 'pt_PT';
