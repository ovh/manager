export default class VpsDisplayIpsCtrl {
  /* @ngInject */
  constructor($translate, CucControllerHelper, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
    this.ips = [];
  }

  $onInit() {
    this.ipsLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getIps(this.serviceName)
          .then((ips) => {
            this.ips = ips;
          })
          .catch((error) =>
            this.CucCloudMessage.error(
              this.$translate.instant('vps_configuration_reversedns_fail', {
                error: error?.data?.message,
              }),
            ),
          ),
    });
    return this.ipsLoader.load();
  }

  cancel() {
    return this.goBack();
  }
}
