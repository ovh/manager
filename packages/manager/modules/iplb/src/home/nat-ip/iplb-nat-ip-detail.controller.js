export default class IpLoadBalancerNatIpDetailCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, IpLoadBalancerNatIpService) {
    this.CucControllerHelper = CucControllerHelper;

    this.IpLoadBalancerNatIpService = IpLoadBalancerNatIpService;

    this.ips = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerNatIpService.getNatIps(this.serviceName),
    });
  }

  $onInit() {
    this.ips.load();
  }

  isModalLoading() {
    return this.ips.loading;
  }
}
