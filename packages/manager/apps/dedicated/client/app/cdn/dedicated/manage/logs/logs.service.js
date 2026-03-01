export default class CdnDedicatedLogsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogKinds() {
    return this.$http.get('/cdn/dedicated/log/kind').then(({ data }) => data);
  }
}
