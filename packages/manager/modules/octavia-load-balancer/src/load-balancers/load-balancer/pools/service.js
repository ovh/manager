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

  getPool(projectId, region, poolId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}`,
      )
      .then(({ data }) => data);
  }

  getPoolMembers(projectId, region, poolId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member`,
      )
      .then(({ data }) => data);
  }

  updateName(projectId, region, poolId, name) {
    return this.$http.put(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}`,
      {
        name,
      },
    );
  }

  getAPISpecifications() {
    return this.$http.get(`/cloud.json`).then(({ data }) => data);
  }
}
