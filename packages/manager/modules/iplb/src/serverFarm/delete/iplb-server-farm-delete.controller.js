export default class IpLoadBalancerServerFarmDeleteCtrl {
  /* @ngInject */
  constructor($stateParams, $uibModalInstance, CucControllerHelper, farm,
    IpLoadBalancerServerFarmService) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerServerFarmService = IpLoadBalancerServerFarmService;

    this.farm = farm;
    this.name = farm.displayName || farm.farmId;
    this.farmId = farm.farmId;
    this.type = farm.type;
  }

  confirm() {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerServerFarmService
        .delete(this.type, this.$stateParams.serviceName, this.farmId)
        .then(response => this.$uibModalInstance.close(response))
        .catch(error => this.$uibModalInstance.dismiss(error)),
    });
    return this.delete.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
