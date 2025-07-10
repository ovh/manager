export default class logsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getCompatibilityMatrix(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/securityOptions/compatibilityMatrix`)
      .then(({ data }) => data);
  }

  disableLogForwarder(serviceName) {
    return this.$http.post(
      `/dedicatedCloud/${serviceName}/logForwarder/disable`,
    );
  }
}
