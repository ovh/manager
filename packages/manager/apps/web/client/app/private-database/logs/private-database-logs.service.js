angular.module('services').service(
  'PrivateDatabaseLogsService',
  class PrivateDatabaseLogsService {
    constructor($http) {
      this.$http = $http;

      this.apiVersion = 'apiv6';
    }

    getLogs(serviceName) {
      return this.$http
        .post(
          `${this.apiVersion}/hosting/privateDatabase/${serviceName}/generateTemporaryLogsLink`,
        )
        .then((res) => res.data);
    }
  },
);
