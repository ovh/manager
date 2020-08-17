import { Environment } from '@ovh-ux/manager-config';
import isObject from 'lodash/isObject';

import { ALLOWED_LANGUAGES, BASE_URL } from './feedback.constants';

export default class {
  // eslint-disable-next-line class-methods-use-this
  getUrl() {
    const defaultLanguage = Object.keys(ALLOWED_LANGUAGES).find(
      (key) => ALLOWED_LANGUAGES[key].isDefault,
    );
    const userLanguage = Environment.getUserLanguage();

    const languageToUse = isObject(ALLOWED_LANGUAGES[userLanguage])
      ? userLanguage
      : defaultLanguage;

    return `${BASE_URL}${languageToUse}`;
  }
}
