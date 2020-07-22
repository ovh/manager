import {
  Environment,
  detectUserLocale,
  findLanguage,
} from '@ovh-ux/manager-config';

/**
 * @ngdoc service
 * @name managerApp.service:TranslateService
 * @description Manage translations
 */
export default class TranslateServiceProvider {
  /**
   * @ngdoc function
   * @methodOf managerApp.service:TranslateService
   * @name setUserLocale
   * @description Set current user locale (in localStorage)
   * @param  {String} locale - (optional) Force to set the given locale identifier
   */
  // eslint-disable-next-line class-methods-use-this
  setUserLocale(locale) {
    Environment.setUserLocale(locale || detectUserLocale());
  }

  /**
   * @ngdoc function
   * @methodOf managerApp.service:TranslateService
   * @name getUserLocale
   * @description Returns the current user locale
   * @param  {Boolean} min - (optional) Return the base locale only
   * @return {String}      - Current locale
   */
  // eslint-disable-next-line class-methods-use-this
  getUserLocale(min) {
    return min ? Environment.getUserLanguage() : Environment.getUserLocale();
  }

  /**
   * @ngdoc function
   * @methodOf managerApp.service:TranslateService
   * @name getGeneralLanguage
   * @description Returns either fr or en depending on current language
   * @return {String}      - Current locale
   */
  getGeneralLanguage() {
    if (/fr/i.test(this.getUserLocale().split('_')[0])) {
      return 'fr';
    }
    return 'en';
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
      findLanguage: (language, country) => findLanguage(language, country),
    };
  }
}
