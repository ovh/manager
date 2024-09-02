import { LANGUAGES, localeRegex, localeStorageKey } from './locale.constants';
import { Region } from '../environment/region.enum';
import { CountryCode } from '../locale/country-code.enum';

export type LangId = 'nl' | 'fr' | 'en' | 'de' | 'es' | 'it' | 'pl' | 'pt';
export * from './country-code.enum';
export * from './locale.constants';
export interface KeyPairName {
  name: string;
  key: string;
}

export type PreferredRegionByLang = {
  [langKey in LangId]?: { [regionKey in Region]?: CountryCode };
};

export interface OVHLanguages {
  available: Array<KeyPairName>;
  defaultLoc: string;
  fallback: string;
  preferred: PreferredRegionByLang;
}

// Default language should not be configurable => MANAGER-15185
export const useDefaultLanguage = (language: string): void => {
  LANGUAGES.defaultLoc = language;
};

const preferredCountry = (language: LangId, region: Region) => {
  if (['FR', 'EN'].includes(language.toUpperCase())) {
    const customLanguage = LANGUAGES?.preferred[language][region];
    if (customLanguage) {
      return customLanguage;
    }
  }
  return language;
};

export const findLanguage = (language: LangId, country: string) => {
  let searchCountry = country;
  if (!country) {
    searchCountry = language;
  }
  const locale = `${language.toLowerCase()}_${searchCountry.toUpperCase()}`;

  const availableLangsKeys = LANGUAGES.available.map(({ key }) => key);

  if (availableLangsKeys.includes(locale)) {
    return locale;
  }

  // Not found: Try to find another country with same base language
  const similarLanguage = availableLangsKeys.find(
    (val) => localeRegex.test(val) && val.match(localeRegex)[1] === language,
  );
  if (similarLanguage) {
    return similarLanguage;
  }

  // Not found
  return LANGUAGES.defaultLoc;
};

export const findAvailableLocale = (
  userLocale: string,
  region = Region.EU,
): string => {
  let splittedLocale: string[] = null;

  // Handle specific browser locales gracefully, example : 'es-419'
  if (userLocale.match(/[-_][0-9]+$/)) {
    splittedLocale = userLocale
      .split(/(-|_)/)[0]
      .match(localeRegex) as string[];
  } else {
    splittedLocale = userLocale.match(localeRegex) as string[];
  }

  if (!splittedLocale) {
    return userLocale || LANGUAGES.defaultLoc;
  }

  // Format the value
  const language = splittedLocale[1];
  const country = splittedLocale[2]
    ? splittedLocale[2]
    : preferredCountry(language as LangId, region);

  // Since following locales has been removed from the language menu picker
  // from the navbar we want to avoid to redirect customer to the default one
  // which is `fr_FR` by design.
  if (['cs', 'fi', 'lt', 'nl'].includes(language)) {
    return findAvailableLocale('en_GB');
  }
  return findLanguage(language as LangId, country);
};

export const detectUserLocale = (): string => {
  if (localStorage[localeStorageKey]) {
    return localStorage[localeStorageKey];
  }
  if (navigator.language || navigator.userLanguage) {
    return navigator.language || navigator.userLanguage;
  }
  return LANGUAGES.defaultLoc;
};

export const saveUserLocale = (locale: string) => {
  localStorage[localeStorageKey] = locale;
};

export const convertLanguageFromOVHToBCP47 = (language: string): string => {
  return language.replace('_', '-');
};
