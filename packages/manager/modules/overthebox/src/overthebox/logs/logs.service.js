export default class OverTheBoxLogsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogKinds(serviceName) {
    return this.$http
      .get(`/overTheBox/${serviceName}/log/kind`)
      .then(({ data }) => data);
  }
}
