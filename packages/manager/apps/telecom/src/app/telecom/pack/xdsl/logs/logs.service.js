export default class XdslLogsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogKinds(serviceName) {
    return this.$http
      .get(`/xdsl/${serviceName}/log/kind`)
      .then(({ data }) => data);
  }
}
