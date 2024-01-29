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
      .then(({ data }) => {
        const [monitor] = data.filter((item) => item.poolId === poolId);
        return monitor;
      });
  }

  createHealthMonitor(projectId, region, poolId, healthMonitor) {
    const postDatas = {
      maxRetries: healthMonitor.maxRetries,
      maxRetriesDown: healthMonitor.maxRetriesDown,
      monitorType: healthMonitor.type,
      name: healthMonitor.name,
      delay: healthMonitor.delay,
      poolId,
      timeout: healthMonitor.timeout,
    };

    if (healthMonitor.urlPath && healthMonitor.expectedCode) {
      postDatas.httpConfiguration = {
        expectedCodes: healthMonitor.expectedCode,
        httpMethod: 'GET',
        httpVersion: '1.0',
        urlPath: healthMonitor.urlPath,
      };
    }

    return this.$http.post(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor`,
      postDatas,
    );
  }

  editHealthMonitorName(projectId, region, healthMonitor, name) {
    return this.$http.put(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitor.id}`,
      { name },
    );
  }

  editHealthMonitor(projectId, region, healthMonitor) {
    const putDatas = {
      delay: healthMonitor.delay,
      httpConfiguration: { ...healthMonitor.httpConfiguration },
      maxRetries: healthMonitor.maxRetries,
      maxRetriesDown: healthMonitor.maxRetriesDown,
      name: healthMonitor.name,
      timeout: healthMonitor.timeout,
    };

    return this.$http.put(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitor.id}`,
      putDatas,
    );
  }
}
