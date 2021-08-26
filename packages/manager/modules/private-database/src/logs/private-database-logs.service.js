export default class PrivateDatabaseLogsService {
  /* @ngInject */
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
}
