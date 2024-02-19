export default class LogToCustomerService {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  getLogKinds(url) {
    return this.iceberg(url)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
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
