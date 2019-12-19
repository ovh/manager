import isObject from 'lodash/isObject';

import {
  ALLOWED_LANGUAGES,
  BASE_URL,
} from './feedback.constants';

export default class {
  /* @ngInject */
  constructor(
    TranslateService,
  ) {
    this.TranslateService = TranslateService;
  }

  getUrl() {
    const defaultLanguage = Object.keys(ALLOWED_LANGUAGES)
      .find((key) => ALLOWED_LANGUAGES[key].isDefault);
    const userLanguage = this.TranslateService.getUserLocale(true);

    const languageToUse = isObject(ALLOWED_LANGUAGES[userLanguage])
      ? userLanguage
      : defaultLanguage;

    return `${BASE_URL}${languageToUse}`;
  }
}
