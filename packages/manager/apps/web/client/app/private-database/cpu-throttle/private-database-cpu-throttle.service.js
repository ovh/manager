angular.module('services').service(
  'CpuThrottleService',
  class CpuThrottleService {
    /* @ngInject */
    constructor($http) {
      this.$http = $http;

      this.swsProxypassPath = 'hosting/privateDatabase';

      this.rootPath = 'apiv6';
    }

    getCpuThrottleList(serviceName) {
      return this.$http
        .get(
          `${this.rootPath}/${this.swsProxypassPath}/${serviceName}/cpuThrottle`,
        )
        .then((res) => res.data);
    }
  },
);
