import isObject from 'lodash/isObject';

import { ALLOWED_LANGUAGES, BASE_URL } from './feedback.constants';

export default class {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  // eslint-disable-next-line class-methods-use-this
  getUrl() {
    const defaultLanguage = Object.keys(ALLOWED_LANGUAGES).find(
      (key) => ALLOWED_LANGUAGES[key].isDefault,
    );
    const userLanguage = this.coreConfig.getUserLanguage();

    const languageToUse = isObject(ALLOWED_LANGUAGES[userLanguage])
      ? userLanguage
      : defaultLanguage;

    return `${BASE_URL}${languageToUse}`;
  }
}
