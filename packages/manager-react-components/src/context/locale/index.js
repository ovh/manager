import { LANGUAGES, localeRegex, localeStorageKey } from './locale.constants';
import { Region } from '../environment/region.enum';

export * from './country-code.enum';
export * from './locale.constants';

export const useDefaultLanguage = (language) => {
  LANGUAGES.defaultLoc = language;
};

const preferredCountry = (language, region) => {
  if (['FR', 'EN'].includes(language.toUpperCase())) {
    const customLanguage = LANGUAGES?.preferred[language][region];
    if (customLanguage) {
      return customLanguage;
    }
  }
  return language;
};

export const findLanguage = (language, country) => {
  let searchCountry = country;
  if (!country) {
    searchCountry = language;
  }
  const locale = `${language.toLowerCase()}_${searchCountry.toUpperCase()}`;
  const availableLangsKeys = LANGUAGES.available.map(({ key }) => key);
  if (availableLangsKeys.includes(locale)) {
    return locale;
  }
  const similarLanguage = availableLangsKeys.find(
    (val) => localeRegex.test(val) && val.match(localeRegex)[1] === language,
  );
  if (similarLanguage) {
    return similarLanguage;
  }
  return LANGUAGES.defaultLoc;
};

export const findAvailableLocale = (userLocale, region = Region.EU) => {
  let splittedLocale = null;
  if (userLocale.match(/[-_][0-9]+$/)) {
    splittedLocale = userLocale.split(/(-|_)/)[0].match(localeRegex);
  } else {
    splittedLocale = userLocale.match(localeRegex);
  }
  if (!splittedLocale) {
    return userLocale || LANGUAGES.defaultLoc;
  }
  const language = splittedLocale[1];
  const country = splittedLocale[2]
    ? splittedLocale[2]
    : preferredCountry(language, region);
  if (['cs', 'fi', 'lt', 'nl'].includes(language)) {
    return findAvailableLocale('en_GB');
  }
  return findLanguage(language, country);
};

export const detectUserLocale = () => {
  if (localStorage[localeStorageKey]) {
    return localStorage[localeStorageKey];
  }
  if (navigator.language || navigator.userLanguage) {
    return navigator.language || navigator.userLanguage;
  }
  return LANGUAGES.defaultLoc;
};

export const saveUserLocale = (locale) => {
  localStorage[localeStorageKey] = locale;
};

export const convertLanguageFromOVHToBCP47 = (language) => {
  return language.replace('_', '-');
};
