export default class HostingCdnLogsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogKinds() {
    return this.$http.get('/hosting/web/cdn/log/kind').then(({ data }) => data);
  }
}
