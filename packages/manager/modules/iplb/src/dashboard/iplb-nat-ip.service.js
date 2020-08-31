export default class IpLoadBalancerNatIpService {
  /* @ngInject */
  constructor($translate, OvhApiIpLoadBalancing, CucServiceHelper) {
    this.$translate = $translate;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucServiceHelper = CucServiceHelper;
  }

  getNatIps(serviceName) {
    return this.IpLoadBalancing.v6()
      .natIp({ serviceName })
      .$promise.catch(
        this.CucServiceHelper.errorHandler('iplb_nat_ip_detail_loading_error'),
      );
  }
}
