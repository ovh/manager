export default class IpLoadBalancerNatIpDetailCtrl {
  /* @ngInject */
  constructor($uibModalInstance, serviceName, CucControllerHelper, IpLoadBalancerNatIpService) {
    this.$uibModalInstance = $uibModalInstance;

    this.serviceName = serviceName;
    this.CucControllerHelper = CucControllerHelper;

    this.IpLoadBalancerNatIpService = IpLoadBalancerNatIpService;

    this.ips = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.IpLoadBalancerNatIpService.getNatIps(this.serviceName),
    });
  }

  $onInit() {
    this.ips.load();
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }

  isModalLoading() {
    return this.ips.loading;
  }
}
