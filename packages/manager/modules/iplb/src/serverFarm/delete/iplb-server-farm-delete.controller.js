export default class IpLoadBalancerServerFarmDeleteCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, IpLoadBalancerServerFarmService) {
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerServerFarmService = IpLoadBalancerServerFarmService;
  }

  $onInit() {
    this.name = this.farm.displayName || this.farm.farmId;
    this.farmId = this.farm.farmId;
    this.type = this.farm.type;
  }

  confirm() {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerServerFarmService.delete(
          this.type,
          this.serviceName,
          this.farmId,
        ).finally(() => this.goBack()),
    });
    return this.delete.load();
  }
}
