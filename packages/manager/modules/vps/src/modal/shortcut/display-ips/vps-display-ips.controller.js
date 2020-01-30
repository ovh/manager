export default class VpsDisplayIpsCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    CucControllerHelper,
    CucCloudMessage,
    serviceName,
    VpsService,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
    this.ips = [];
  }

  $onInit() {
    this.ipsLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getIps(this.serviceName)
          .then((data) => {
            this.ips = data.results;
          })
          .catch(() =>
            this.CucCloudMessage.error(
              this.$translate.instant('vps_configuration_reversedns_fail'),
            ),
          ),
    });
    return this.ipsLoader.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
