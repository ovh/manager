import get from 'lodash/get';
import has from 'lodash/has';

angular.module('App').service(
  'ServicesHelper',
  class ServicesHelper {
    constructor($http, $q, CORE_MANAGER_URLS, SERVICES_TARGET_URLS) {
      this.$http = $http;
      this.$q = $q;
      this.CORE_MANAGER_URLS = CORE_MANAGER_URLS;
      this.SERVICES_TARGET_URLS = SERVICES_TARGET_URLS;
    }

    getServiceDetails(service) {
      if (has(service, 'route.url')) {
        return this.$http
          .get(get(service, 'route.url'))
          .then(({ data }) => data);
      }
      return this.$q.when({});
    }

    getServiceManageUrl(service) {
      if (!has(service, 'route.path')) {
        return '';
      }

      const target = get(this.SERVICES_TARGET_URLS, get(service, 'route.path'));
      const basePath = get(this.CORE_MANAGER_URLS, target.univers);

      return `${basePath}/#${target.url.replace(
        '{serviceName}',
        get(service, 'resource.name'),
      )}`;
    }

    getServiceType(service) {
      return get(
        this.SERVICES_TARGET_URLS,
        `${get(service, 'route.path')}.type`,
      );
    }
  },
);
