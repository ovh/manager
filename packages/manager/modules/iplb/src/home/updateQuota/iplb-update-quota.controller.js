export default class IpLoadBalancerUpdateQuotaCtrl {
  /* @ngInject */
  constructor($stateParams, $uibModalInstance, CucControllerHelper, IpLoadBalancerHomeService,
    quota) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerHomeService = IpLoadBalancerHomeService;
    this.quota = Object.assign({}, quota);

    // Convert bytes to GiB
    this.alert = this.quota.alert / Math.pow(1000, 3); // eslint-disable-line

    this.saving = false;
  }

  updateQuota() {
    this.update = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerHomeService
        .updateQuota(this.$stateParams.serviceName, this.quota.zone, this.alert * Math.pow(1000, 3)) // eslint-disable-line
        .then(response => this.$uibModalInstance.close(response))
        .catch(error => this.$uibModalInstance.close(error)),
    });
    return this.update.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
