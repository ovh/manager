export default class LogToCustomerService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogSourceUrl(source) {
    return this.$http.post(source).then(({ data }) => data);
  }

  getLogs(url) {
    return this.$http.get(`${url}&sort=asc&limit=20`).then(({ data }) => data);
  }
}
