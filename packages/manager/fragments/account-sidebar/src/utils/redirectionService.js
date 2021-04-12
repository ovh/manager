import { forOwn, get, isString, keys, some, startsWith } from 'lodash-es';
import { Environment } from '@ovh-ux/manager-config';

import constants from '../constants/redirection';

export default class RedirectionService {
  static getURL(id, params = {}) {
    const regionConstants = constants[Environment.getRegion()];
    let url = get(regionConstants, id);

    // if url is an object, then it depends on the ovhSUbsidiary
    if (!isString(url) && keys(url).length) {
      url = get(url, params.ovhSubsidiary);
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

  static validate(url) {
    return some(Object.values(Environment.getApplicationURLS()), (appURL) =>
      startsWith(url, appURL),
    );
  }
}
