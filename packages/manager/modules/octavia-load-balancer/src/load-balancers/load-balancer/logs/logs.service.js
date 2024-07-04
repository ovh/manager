export default class OctaviaLoadBalancerLogsService {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  getLogKinds(projectId, region) {
    return this.iceberg(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/log/kind`,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
  }
}
