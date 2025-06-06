export default class IplbLogsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogKinds(serviceName) {
    return this.$http
      .get(`/ipLoadbalancing/${serviceName}/log/kind`)
      .then(({ data }) => data);
  }
}
