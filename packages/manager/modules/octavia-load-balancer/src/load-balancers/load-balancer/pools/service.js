export default class OctaviaLoadBalancerPoolsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getPools(projectId, region) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${region}/loadbalancing/pool`)
      .then(({ data }) => data);
  }

  deletePool(projectId, region, poolId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}`,
    );
  }
}
