export default class OctaviaLoadBalancerPoolsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  createPool(
    projectId,
    region,
    loadbalancerId,
    name,
    algorithm,
    protocol,
    sessionPersistenceType,
    cookieName = '',
  ) {
    return this.$http.post(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool`,
      {
        loadbalancerId,
        name,
        algorithm,
        protocol,
        sessionPersistence: sessionPersistenceType
          ? { type: sessionPersistenceType, cookieName }
          : null,
      },
    );
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

  getAPISpecifications() {
    return this.$http.get(`/cloud.json`).then(({ data }) => data);
  }
}
