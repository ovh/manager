import bowser from 'bowser';
import { SUPPORTED_BROWSERS } from './constants';

export default class BrowserAlertService {
  isSupported() {
    return bowser.check(SUPPORTED_BROWSERS.unsupported);
  }

  isDeprecated() {
    return !bowser.check(SUPPORTED_BROWSERS.deprecated);
  }
}
