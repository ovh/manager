export default class IpLoadBalancerService {
  /* @ngInject */
  constructor(OvhApiIpLoadBalancing, CucServiceHelper) {
    this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucServiceHelper = CucServiceHelper;
  }

  getSubscription(serviceName) {
    return this.OvhApiIpLoadBalancing.v6()
      .serviceInfos({
        serviceName,
      })
      .$promise.then((response) => response)
      .catch(
        this.CucServiceHelper.errorHandler('iplb_subscription_loading_error'),
      );
  }
}
