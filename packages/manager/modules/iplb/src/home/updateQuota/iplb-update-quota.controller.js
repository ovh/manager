export default class IpLoadBalancerUpdateQuotaCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $uibModalInstance,
    CucControllerHelper,
    IpLoadBalancerHomeService,
    quota,
  ) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerHomeService = IpLoadBalancerHomeService;
    this.quota = { ...quota };

    // Convert bytes to GiB
    // eslint-disable-next-line no-restricted-properties
    this.alert = this.quota.alert / Math.pow(1000, 3);

    this.saving = false;
  }

  updateQuota() {
    this.update = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerHomeService.updateQuota(
          this.$stateParams.serviceName,
          this.quota.zone,
          // eslint-disable-next-line no-restricted-properties
          this.alert * Math.pow(1000, 3),
        )
          .then((response) => this.$uibModalInstance.close(response))
          .catch((error) => this.$uibModalInstance.close(error)),
    });
    return this.update.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
