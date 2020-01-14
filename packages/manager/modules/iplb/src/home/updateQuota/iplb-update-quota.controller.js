export default class IpLoadBalancerUpdateQuotaCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, IpLoadBalancerHomeService) {
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerHomeService = IpLoadBalancerHomeService;
  }

  $onInit() {
    this.saving = false;
    // Convert bytes to GiB
    this.alert = this.quota.alert / (1000 ** 3); // eslint-disable-line
  }

  updateQuota() {
    this.update = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerHomeService.updateQuota(
          this.serviceName,
          this.quota.zone,
          this.alert * 1000 ** 3,
        ) // eslint-disable-line
          .then(() => this.goBack(true))
          .finally(() => this.goBack()),
    });
    return this.update.load();
  }
}
