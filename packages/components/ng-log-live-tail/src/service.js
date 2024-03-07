export default class LogLiveTailService {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  getLogSourceUrl(source, kind) {
    return this.$http
      .post(source, {
        kind,
      })
      .then(({ data }) => data);
  }

  getLogs(url) {
    return this.$http.get(`${url}&sort=asc&limit=20`).then(({ data }) => data);
  }
}
