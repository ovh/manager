import kebabCase from 'lodash/kebabCase';
import get from 'lodash/get';
import has from 'lodash/has';

import { SERVICES_TARGET_URLS } from '../constants/servicesHelper.constants';

export default class ServicesHelper {
  /* @ngInject */
  constructor($http, $q, coreURLBuilder) {
    this.$http = $http;
    this.$q = $q;
    this.SERVICES_TARGET_URLS = SERVICES_TARGET_URLS;
    this.coreURLBuilder = coreURLBuilder;
  }

  getServiceDetails(service) {
    if (has(service, 'route.url')) {
      return this.$http.get(get(service, 'route.url')).then(({ data }) => data);
    }
    return this.$q.when({});
  }

  getServiceManageUrl(service) {
    if (!has(service, 'route.path')) {
      return '';
    }

    const target = get(this.SERVICES_TARGET_URLS, get(service, 'route.path'));

    if (!(target?.universe && target?.url)) {
      return '';
    }

    return this.coreURLBuilder.buildURL(
      kebabCase(target.universe),
      target.url,
      {
        serviceName: get(service, 'resource.name'),
      },
    );
  }

  getServiceType(service) {
    return get(this.SERVICES_TARGET_URLS, `${get(service, 'route.path')}.type`);
  }
}
