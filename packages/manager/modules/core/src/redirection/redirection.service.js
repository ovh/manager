import forOwn from 'lodash/forOwn';
import get from 'lodash/get';
import constants from './redirection.constants';

export default class RedirectionService {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  getURL(id, params = {}) {
    const regionConstants = constants[this.coreConfig.getRegion()];
    let url = get(regionConstants, id);
    if (url) {
      const keyValidator = /^[\w-]+$/;
      forOwn(params, (value, key) => {
        if (keyValidator.test(key)) {
          url = url.replace(`:${key}`, encodeURIComponent(value));
        }
      });
    }
    return url;
  }
}
