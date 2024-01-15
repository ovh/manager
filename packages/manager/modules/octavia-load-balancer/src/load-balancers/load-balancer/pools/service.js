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

  getPools(projectId, region, loadbalancerId) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${region}/loadbalancing/pool`, {
        params: {
          loadbalancerId,
        },
      })
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

  editPool(projectId, region, poolId, name, algorithm, sessionPersistence) {
    return this.$http.put(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}`,
      {
        name,
        algorithm,
        sessionPersistence,
      },
    );
  }
}
