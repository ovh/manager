export default class DashboardService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getIpsFailover() {
    return this.$http.get('/ip/service').then(({ data }) => data);
  }
}
