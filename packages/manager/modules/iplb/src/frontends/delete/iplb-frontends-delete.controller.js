export default class IpLoadBalancerFrontendDeleteCtrl {
  /* @ngInject */
  constructor(CucControllerHelper,
    IpLoadBalancerFrontendsService) {
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerFrontendsService = IpLoadBalancerFrontendsService;
  }

  $onInit() {
    this.name = this.frontend.displayName || this.frontend.frontendId;
    this.frontendId = this.frontend.frontendId;
    this.type = this.frontend.protocol;
  }

  confirm() {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerFrontendsService
        .deleteFrontend(this.type, this.serviceName, this.frontendId)
        .finally(() => this.goBack()),
    });
    return this.delete.load();
  }

  cancel() {
    this.goBack();
  }
}
