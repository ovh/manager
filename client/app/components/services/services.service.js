angular.module('App').service('ServicesHelper', class ServicesHelper {
  constructor($http, $q, constants, SERVICES_TARGET_URLS) {
    this.$http = $http;
    this.$q = $q;
    this.constants = constants;
    this.SERVICES_TARGET_URLS = SERVICES_TARGET_URLS;
  }

  getServiceDetails(service) {
    if (_.has(service, 'route.url')) {
      return this.$http.get(_.get(service, 'route.url')).then(({ data }) => data);
    }
    return this.$q.when({});
  }

  getServiceManageUrl(service) {
    if (!_.has(service, 'route.path')) {
      return '';
    }

    const target = _.get(this.SERVICES_TARGET_URLS, _.get(service, 'route.path'));
    const basePath = _.get(this.constants.MANAGER_URLS, target.univers);

    return `${basePath}#${target.url.replace('{serviceName}', _.get(service, 'resource.name'))}`;
  }

  getServiceType(service) {
    return _.get(this.SERVICES_TARGET_URLS, `${_.get(service, 'route.path')}.type`);
  }
});
