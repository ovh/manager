export default class OctaviaLoadBalancerListenersService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  createListener(
    projectId,
    region,
    loadbalancerId,
    name,
    protocol,
    port,
    defaultPoolId,
  ) {
    return this.$http.post(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/listener`,
      {
        loadbalancerId,
        name,
        protocol,
        port,
        defaultPoolId,
      },
    );
  }

  deleteListener(projectId, region, listenerId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
    );
  }

  editListener(projectId, region, listenerId, name, defaultPoolId) {
    return this.$http.put(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
      {
        name,
        defaultPoolId,
      },
    );
  }

  getListener(projectId, region, listenerId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
      )
      .then(({ data }) => data);
  }

  getListeners(projectId, region, loadbalancerId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/listener`,
        {
          params: {
            loadbalancerId,
          },
        },
      )
      .then(({ data }) => data);
  }
}
