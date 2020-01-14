export default class IpLoadBalancerFailoverIpDetailCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, IpLoadBalancerFailoverIpService) {
    this.CucControllerHelper = CucControllerHelper;

    this.IpLoadBalancerFailoverIpService = IpLoadBalancerFailoverIpService;

    this.ips = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerFailoverIpService.getFailoverIps(this.serviceName),
    });
  }

  $onInit() {
    this.ips.load();
  }

  isModalLoading() {
    return this.ips.loading;
  }
}
