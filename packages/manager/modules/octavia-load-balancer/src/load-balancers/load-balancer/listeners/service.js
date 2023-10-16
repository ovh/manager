export default class OctaviaLoadBalancerListenersService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
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
