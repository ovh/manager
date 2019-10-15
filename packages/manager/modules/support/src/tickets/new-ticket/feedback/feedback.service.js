import includes from 'lodash/includes';

import {
  ALLOWED_LANGUAGES,
  BASE_URL,
  DEFAULT_LANGUAGE,
} from './feedback.constants';

export default class {
  /* @ngInject */
  constructor(
    TranslateService,
  ) {
    this.TranslateService = TranslateService;
  }

  getUrl() {
    const userLanguage = this.TranslateService.getUserLocale(true);

    const languageToUse = includes(ALLOWED_LANGUAGES, userLanguage)
      ? userLanguage
      : DEFAULT_LANGUAGE;

    return `${BASE_URL}${languageToUse}`;
  }
}
