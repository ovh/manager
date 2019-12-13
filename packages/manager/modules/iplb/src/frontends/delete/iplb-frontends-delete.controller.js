export default class IpLoadBalancerFrontendDeleteCtrl {
  /* @ngInject */
  constructor($stateParams, $uibModalInstance, CucControllerHelper, frontend,
    IpLoadBalancerFrontendsService) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerFrontendsService = IpLoadBalancerFrontendsService;

    this.frontend = frontend;
    this.name = frontend.displayName || frontend.frontendId;
    this.frontendId = frontend.frontendId;
    this.type = frontend.protocol;
  }

  confirm() {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerFrontendsService
        .deleteFrontend(this.type, this.$stateParams.serviceName, this.frontendId)
        .then(response => this.$uibModalInstance.close(response))
        .catch(error => this.$uibModalInstance.dismiss(error)),
    });
    return this.delete.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
