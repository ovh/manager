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
        expectedCodes: healthMonitor.expectedCode.toString(),
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

  editHealthMonitor(projectId, region, healthMonitorId, model) {
    const putDatas = {
      maxRetries: model.maxRetries,
      maxRetriesDown: model.maxRetriesDown,
      name: model.name,
      delay: model.delay,
      timeout: model.timeout,
    };

    if (model.urlPath && model.expectedCode) {
      putDatas.httpConfiguration = {
        expectedCodes: model.expectedCode.toString(),
        httpMethod: 'GET',
        httpVersion: '1.0',
        urlPath: model.urlPath,
      };
    }

    return this.$http.put(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitorId}`,
      putDatas,
    );
  }

  deleteHealthMonitor(projectId, region, healthMonitorId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitorId}`,
    );
  }
}
