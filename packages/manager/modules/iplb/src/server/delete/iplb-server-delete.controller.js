export default class IpLoadBalancerServerDeleteCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, IpLoadBalancerServerService) {
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerServerService = IpLoadBalancerServerService;
  }

  $onInit() {
    this.name = this.server.displayName || this.server.farmId;
    this.farmId = this.farm.farmId;
    this.serverId = this.server.serverId;
  }

  confirm() {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerServerService.delete(
          this.serviceName,
          this.farmId,
          this.serverId,
        ).finally(() => this.goBack()),
    });
    return this.delete.load();
  }
}
