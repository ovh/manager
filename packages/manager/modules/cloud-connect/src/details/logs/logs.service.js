export default class CloudConntectLogsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogKinds(serviceName) {
    return this.$http
      .get(`/ovhCloudConnect/${serviceName}/log/kind`)
      .then(({ data }) => data);
  }
}
