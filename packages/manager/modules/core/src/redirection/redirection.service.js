import forOwn from 'lodash/forOwn';
import get from 'lodash/get';
import isString from 'lodash/isString';
import keys from 'lodash/keys';
import constants from './redirection.constants';

export default class RedirectionService {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  /**
   * Returns the absolute URL identified by 'id'.
   * In case url with dynamic parts, the 'params' parameter is used to set them.
   * @example
   * // with domain equals to 'https://www.ovh.com/manager/web/domain/:domainId'
   * getURL('domain', { domainId: 'foo.bar' }
   * @returns https://www.ovh.com/manager/web/domain/foo.bar
   */
  getURL(id, params = {}) {
    const regionConstants = constants[this.coreConfig.getRegion()];
    let url = get(regionConstants, id);

    // if url is an object, then it depends on the ovhSUbsidiary
    if (keys(url).length) {
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
}
