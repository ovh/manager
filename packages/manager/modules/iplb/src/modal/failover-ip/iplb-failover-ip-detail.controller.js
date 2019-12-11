export default class IpLoadBalancerFailoverIpDetailCtrl {
  /* @ngInject */
  constructor($uibModalInstance, serviceName, CucControllerHelper,
    IpLoadBalancerFailoverIpService) {
    this.$uibModalInstance = $uibModalInstance;

    this.serviceName = serviceName;
    this.CucControllerHelper = CucControllerHelper;

    this.IpLoadBalancerFailoverIpService = IpLoadBalancerFailoverIpService;

    this.ips = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.IpLoadBalancerFailoverIpService.getFailoverIps(this.serviceName),
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
