export default class OctaviaLoadBalanderService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  deleteLoadBalancer(projectId, loadBalancerRegion, loadBalancerId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/region/${loadBalancerRegion}/loadbalancing/loadbalancer/${loadBalancerId}`,
    );
  }
}
