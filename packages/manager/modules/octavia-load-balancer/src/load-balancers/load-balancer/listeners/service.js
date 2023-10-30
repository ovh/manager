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

  getPools(projectId, region) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${region}/loadbalancing/pool`)
      .then(({ data }) => data);
  }
}
