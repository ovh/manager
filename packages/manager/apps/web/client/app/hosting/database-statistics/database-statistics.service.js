angular.module('services').service(
  'DatabaseStatistics',
  class DatabaseStatistics {
    /* @ngInject */
    constructor($http) {
      this.$http = $http;
    }

    getDatabaseMetricsToken(serviceName, database) {
      return this.$http
        .get(`/hosting/web/${serviceName}/database/${database}/metricsToken`)
        .then(({ data }) => data);
    }
  },
);
