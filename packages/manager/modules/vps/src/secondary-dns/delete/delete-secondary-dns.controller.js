export default class DeleteSecondaryDnsCtrl {
  /* @ngInject */
  constructor($translate, CucControllerHelper, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
  }

  cancel() {
    return this.goBackToSecondaryDns();
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
          .finally(() => this.goBackToSecondaryDns()),
    });
    return this.delete.load();
  }
}
