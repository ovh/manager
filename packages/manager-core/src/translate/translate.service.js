import find from 'lodash/find';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';

/**
 * @ngdoc service
 * @name managerApp.service:TranslateService
 * @description Manage translations
 */
export default class TranslateServiceProvider {
  constructor(LANGUAGES, TARGET) {
    'ngInject';

    this.LANGUAGES = LANGUAGES;
    this.TARGET = TARGET;
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
      const country = splittedLocale[2] ? splittedLocale[2] : this.preferredCountry(language);
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
      const customLanguage = get(this.LANGUAGES.preferred, `${language}.${this.TARGET}`);
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
      val => this.localeRegex.test(val) && val.match(this.localeRegex)[1] === language,
    );
    if (similarLanguage) {
      return similarLanguage;
    }
    // Not found
    return this.LANGUAGES.defaultLoc;
  }

  $get() {
    return {
      getUserLocale: locale => this.getUserLocale(locale),
      getGeneralLanguage: () => this.getGeneralLanguage(),
      setUserLocale: min => this.setUserLocale(min),
    };
  }
}
