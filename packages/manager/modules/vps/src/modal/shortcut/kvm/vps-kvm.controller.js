export default class VpsKvmCtrl {
  /* @ngInject */
  constructor($sce, $translate, $uibModalInstance, CucControllerHelper, CucCloudMessage, noVNC,
    serviceName, VpsService) {
    this.$sce = $sce;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.noVNC = noVNC;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;

    this.consoleUrl = null;
    this.kvm = {};
  }

  $onInit() {
    if (this.noVNC) {
      this.loadKvm();
    } else {
      this.kvmUrl();
    }
  }

  kvmUrl() {
    this.kvmUrlLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.getKVMConsoleUrl(this.serviceName)
        .then((data) => {
          this.consoleUrl = this.$sce.trustAsResourceUrl(data);
        })
        .catch(() => this.CucCloudMessage.error(this.$translate.instant('vps_configuration_kvm_fail'))),
    });
    return this.kvmUrlLoader.load();
  }

  loadKvm() {
    this.kvmLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.getKVMAccess(this.serviceName)
        .then((data) => { this.kvm = data; })
        .catch(() => this.CucCloudMessage.error(this.$translate.instant('vps_configuration_kvm_fail'))),
    });
    return this.kvmLoader.load();
  }

  close() {
    this.$uibModalInstance.dismiss();
  }
}
