export default class OctaviaLoadBalancerHealthMonitorService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getHealthMonitor(projectId, region, poolId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor`,
      )
      .then(({ data }) =>
        data.filter((healthMonitor) => healthMonitor.poolId === poolId),
      );
  }

  createHealthMonitor(projectId, region, poolId, healthMonitor) {
    const postDatas = {
      maxRetries: healthMonitor.maxRetries,
      maxRetriesDown: healthMonitor.maxRetriesDown,
      monitorType: healthMonitor.type,
      name: healthMonitor.name,
      periodicity: `PT${healthMonitor.periodicity}S`,
      poolId,
      timeout: healthMonitor.timeout,
    };

    if (healthMonitor.urlPath && healthMonitor.expectedCode) {
      postDatas.httpConfiguration = {
        expectedCodes: [healthMonitor.expectedCode],
        httpMethod: 'GET',
        httpVersion: 1.0,
        urlPath: healthMonitor.urlPath,
      };
    }

    return this.$http.post(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor`,
      postDatas,
    );
  }
}
