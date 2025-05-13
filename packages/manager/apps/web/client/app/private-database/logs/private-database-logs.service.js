export default class PrivateDatabaseLogsService {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  getLogKinds(serviceName) {
    return this.iceberg(`/hosting/privateDatabase/${serviceName}/log/kind`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
  }
}
