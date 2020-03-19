import bowser from 'bowser';
import { SUPPORTED_BROWSERS } from './constants';

/* eslint-disable class-methods-use-this */
export default class BrowserAlertService {
  isSupported() {
    return bowser.check(SUPPORTED_BROWSERS.unsupported);
  }

  isDeprecated() {
    return !bowser.check(SUPPORTED_BROWSERS.deprecated);
  }
}
/* eslint-enable class-methods-use-this */
