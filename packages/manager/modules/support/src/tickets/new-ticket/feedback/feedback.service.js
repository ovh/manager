import { BASE_URL } from './feedback.constants';

export default class {
  static getUrl(language) {
    return `${BASE_URL}${language}`;
  }
}
