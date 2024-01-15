export default class OctaviaLoadBalancerListenersService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getPolicies(projectId, region, listenerId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy?listenerId=${listenerId}`,
      )
      .then(({ data }) => data);
  }
}
