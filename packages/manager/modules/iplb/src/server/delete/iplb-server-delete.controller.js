export default class IpLoadBalancerServerDeleteCtrl {
  /* @ngInject */
  constructor($stateParams, $uibModalInstance, CucControllerHelper, farm, server,
    IpLoadBalancerServerService) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerServerService = IpLoadBalancerServerService;

    this.farm = farm;
    this.server = server;
    this.name = server.displayName || server.farmId;
    this.farmId = farm.farmId;
    this.serverId = server.serverId;
  }

  confirm() {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerServerService
        .delete(this.$stateParams.serviceName, this.farmId, this.serverId)
        .then(response => this.$uibModalInstance.close(response))
        .catch(error => this.$uibModalInstance.dismiss(error)),
    });
    return this.delete.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
