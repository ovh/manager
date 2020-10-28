import { get } from 'lodash-es';
import { LANGUAGES, localeRegex, localeStorageKey } from './locale.constants';

const preferredCountry = (language, region) => {
  if (['FR', 'EN'].includes(language.toUpperCase())) {
    const customLanguage = get(LANGUAGES.preferred, `${language}.${region}`);
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

export const findAvailableLocale = (userLocale, region) => {
  const splittedLocale = userLocale.match(localeRegex);

  if (!splittedLocale) {
    return userLocale || LANGUAGES.defaultLoc;
  }

  // Format the value
  const language = splittedLocale[1];
  const country = splittedLocale[2]
    ? splittedLocale[2]
    : preferredCountry(language, region);

  // Since following locales has been removed from the language menu picker
  // from the navbar we want to avoid to redirect customer to the default one
  // which is `fr_FR` by design.
  if (['cs', 'nl'].includes(language)) {
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

/**
 * BCP 47 (also known as IETF language tag) is an international standard to identify human languages
 * @param {string} language The language to convert, in the OVHcloud format (i.e.: 'fr_FR')
 * @returns {string} The languag converted to BCP 47 (i.e.: 'fr-FR')
 */
export const convertLanguageFromOVHToBCP47 = (language) => {
  return language.replace('_', '-');
};

export default {
  convertLanguageFromOVHToBCP47,
  detectUserLocale,
  saveUserLocale,
  findAvailableLocale,
  findLanguage,
};
