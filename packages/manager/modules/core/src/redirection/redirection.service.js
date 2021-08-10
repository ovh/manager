import { forOwn, get, isString, keys, some, startsWith } from 'lodash-es';

import constants from './redirection.constants';

export default class RedirectionService {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  getURL(id, params = {}) {
    const regionConstants = constants[this.coreConfig.getRegion()];
    let url = get(regionConstants, id);

    // if url is an object, then it depends on the ovhSUbsidiary
    if (!isString(url) && keys(url).length) {
      url = get(url, this.coreConfig.getUser().ovhSubsidiary);
    }

    // replace dynamic parts of the url with parameters
    // example :
    // /foo/bar/:section/:id
    // params = { section: 'hello', id: 'world' }
    if (isString(url)) {
      const paramValidator = /^[\w-]+$/;
      forOwn(params, (value, key) => {
        if (paramValidator.test(key)) {
          url = url.replace(`:${key}`, encodeURIComponent(value));
        }
      });
    }

    return url;
  }

  validate(url) {
    return some(Object.values(this.coreConfig.getApplicationURLS()), (appURL) =>
      startsWith(url, appURL),
    );
  }
}
