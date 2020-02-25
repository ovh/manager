export default class AddSecondaryDnsCtrl {
  /* @ngInject */
  constructor($translate, CucControllerHelper, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
    this.available = null;
    this.model = null;
  }

  $onInit() {
    this.loadAvailableDns();
  }

  loadAvailableDns() {
    this.availableDns = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getSecondaryDNSAvailable(this.serviceName)
          .then((data) => {
            this.available = data;
          })
          .catch(() =>
            this.CucCloudMessage.error(
              this.$translate.instant(
                'vps_configuration_secondarydns_add_fail',
              ),
            ),
          ),
    });
    return this.availableDns.load();
  }

  cancel() {
    this.goBackToSecondaryDns();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.addDns = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.addSecondaryDnsDomain(this.serviceName, this.model)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_configuration_secondarydns_add_success',
                { domain: this.model },
              ),
            ),
          )
          .catch((err) => this.CucCloudMessage.error(err.message))
          .finally(() => this.goBackToSecondaryDns()),
    });
    return this.addDns.load();
  }
}
