import _Environment from './environment';

import {
  convertLanguageFromOVHToBCP47 as _convertLanguageFromOVHToBCP47,
  detectUserLocale as _detectUserLocale,
  findLanguage as _findLanguage,
} from './locale';

import {
  LANGUAGES as _LANGUAGES,
  localeStorageKey as _localeStorageKey,
} from './locale/locale.constants';

export const Environment = _Environment;

export const convertLanguageFromOVHToBCP47 = _convertLanguageFromOVHToBCP47;
export const detectUserLocale = _detectUserLocale;
export const findLanguage = _findLanguage;
export const LANGUAGES = _LANGUAGES;
export const localeStorageKey = _localeStorageKey;

export default {
  convertLanguageFromOVHToBCP47,
  Environment,
  detectUserLocale,
  findLanguage,
  LANGUAGES,
  localeStorageKey, // TODO(@antleblanc): Remove it on February 4th, 2021.
};
