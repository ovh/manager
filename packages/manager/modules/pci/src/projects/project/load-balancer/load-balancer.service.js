export default class {
  /* @ngInject */
  constructor(atInternet, OvhApiCloudProject) {
    this.atInternet = atInternet;
    this.LoadBalancerApi = OvhApiCloudProject.LoadBalancer().v6();
  }

  getLoadBalancers(serviceName) {
    return this.LoadBalancerApi.query({
      serviceName,
    }).$promise;
  }

  getLoadBalancerDetails(serviceName, loadBalancerId) {
    return this.LoadBalancerApi.get({
      serviceName,
      loadBalancerId,
    }).$promise;
  }

  trackClick(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}
