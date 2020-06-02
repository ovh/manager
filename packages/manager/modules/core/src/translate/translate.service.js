import { find, get, indexOf, map } from 'lodash-es';

/**
 * @ngdoc service
 * @name managerApp.service:TranslateService
 * @description Manage translations
 */
export default class TranslateServiceProvider {
  /* @ngInject */

  constructor(CORE_LANGUAGES, coreConfigProvider) {
    this.LANGUAGES = CORE_LANGUAGES;
    this.coreConfigProvider = coreConfigProvider;
    this.storageKey = 'univers-selected-language';
    this.localeRegex = /^([a-zA-Z]+)(?:[_-]([a-zA-Z]+))?$/;
    this.availableLangsKeys = map(this.LANGUAGES.available, 'key');
    this.currentLanguage = this.LANGUAGES.defaultLoc;
  }

  /**
   * @ngdoc function
   * @methodOf managerApp.service:TranslateService
   * @name setUserLocale
   * @description Set current user locale (in localStorage)
   * @param  {String} locale - (optional) Force to set the given locale identifier
   */
  setUserLocale(locale) {
    let definedLocale = locale;
    if (!definedLocale) {
      if (localStorage[this.storageKey]) {
        definedLocale = localStorage[this.storageKey];
      } else if (navigator.language || navigator.userLanguage) {
        definedLocale = navigator.language || navigator.userLanguage;
      } else {
        definedLocale = this.LANGUAGES.defaultLoc;
      }
    }
    const splittedLocale = definedLocale.match(this.localeRegex);
    if (splittedLocale) {
      // Format the value
      const language = splittedLocale[1];
      const country = splittedLocale[2]
        ? splittedLocale[2]
        : this.preferredCountry(language);
      this.currentLanguage = this.findLanguage(language, country);
    } else {
      // Incorrect value
      this.currentLanguage = this.currentLanguage || this.LANGUAGES.defaultLoc;
    }
    // Save it!
    localStorage[this.storageKey] = this.currentLanguage;
  }

  /**
   * @ngdoc function
   * @methodOf managerApp.service:TranslateService
   * @name getUserLocale
   * @description Returns the current user locale
   * @param  {Boolean} min - (optional) Return the base locale only
   * @return {String}      - Current locale
   */
  getUserLocale(min) {
    if (min) {
      return this.currentLanguage.split('_')[0];
    }
    return this.currentLanguage;
  }

  /**
   * @ngdoc function
   * @methodOf managerApp.service:TranslateService
   * @name getGeneralLanguage
   * @description Returns either fr or en depending on current language
   * @return {String}      - Current locale
   */
  getGeneralLanguage() {
    if (/fr/i.test(this.currentLanguage.split('_')[0])) {
      return 'fr';
    }
    return 'en';
  }

  preferredCountry(language) {
    if (indexOf(['FR', 'EN'], language.toUpperCase() > -1)) {
      const customLanguage = get(
        this.LANGUAGES.preferred,
        `${language}.${this.coreConfigProvider.getRegion()}`,
      );
      if (customLanguage) {
        return customLanguage;
      }
    }
    return language;
  }

  findLanguage(language, country) {
    const locale = `${language.toLowerCase()}_${country.toUpperCase()}`;
    if (this.availableLangsKeys.indexOf(locale) > -1) {
      return locale;
    }
    // Not found: Try to find another country with same base language
    const similarLanguage = find(
      this.availableLangsKeys,
      (val) =>
        this.localeRegex.test(val) &&
        val.match(this.localeRegex)[1] === language,
    );
    if (similarLanguage) {
      return similarLanguage;
    }

    if (language === 'nl') {
      this.setUserLocale('en_GB');
      return 'en_GB';
    }

    // Not found
    return this.LANGUAGES.defaultLoc;
  }

  /**
   * BCP 47 (also known as IETF language tag) is an international standard to identify human languages
   * @param {string} language The language to convert, in the OVHcloud format (i.e.: 'fr_FR')
   * @returns {string} The languag converted to BCP 47 (i.e.: 'fr-FR')
   */
  static convertFromOVHToBCP47(language) {
    return language.replace('_', '-');
  }

  $get() {
    return {
      getUserLocale: (locale) => this.getUserLocale(locale),
      getGeneralLanguage: () => this.getGeneralLanguage(),
      setUserLocale: (min) => this.setUserLocale(min),
    };
  }
}
