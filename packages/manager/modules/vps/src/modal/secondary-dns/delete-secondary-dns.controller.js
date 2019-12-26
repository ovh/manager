export default class DeleteSecondaryDnsCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    CucControllerHelper,
    CucCloudMessage,
    domain,
    serviceName,
    VpsService,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.domain = domain;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.deleteSecondaryDnsDomain(
          this.serviceName,
          this.domain.domain,
        )
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_configuration_secondarydns_delete_success',
              ),
            ),
          )
          .catch(() =>
            this.CucCloudMessage.error(
              this.$translate.instant(
                'vps_configuration_secondarydns_delete_fail',
                { domain: this.domain.domain },
              ),
            ),
          )
          .finally(() => this.$uibModalInstance.close()),
    });
    return this.delete.load();
  }
}
