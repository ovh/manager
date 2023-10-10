import isObject from 'lodash/isObject';
import {
  ALLOWED_LANGUAGES,
  BASE_URL_SURVEY,
} from './network-security.constant';

export default class NetworkSecurityController {
  /* @ngInject */
  constructor(coreConfig, networkSecurityService) {
    this.coreConfig = coreConfig;
    this.networkSecurityService = networkSecurityService;
    this.ALLOWED_LANGUAGES = ALLOWED_LANGUAGES;
    this.BASE_URL_SURVEY = BASE_URL_SURVEY;
  }

  $onInit() {
    // Get default language
    const defaultLanguage = Object.keys(this.ALLOWED_LANGUAGES).find(
      (key) => this.ALLOWED_LANGUAGES[key].isDefault,
    );
    const userLanguage = this.coreConfig.getUserLanguage();

    const languageToUse = isObject(this.ALLOWED_LANGUAGES[userLanguage])
      ? userLanguage
      : defaultLanguage;

    // Get user
    const user = this.coreConfig.getUser();

    // Build url for survey link
    this.surveyUrl = `${this.BASE_URL_SURVEY}${languageToUse}&nic=${user.nichandle}`;
  }
}
