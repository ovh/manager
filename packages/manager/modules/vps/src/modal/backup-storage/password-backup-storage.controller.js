export default class PasswordBackupStorageCtrl {
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
    this.serviceName = serviceName;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.loader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.requestFtpBackupPassword(this.serviceName)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_backup_storage_access_forgot_password_success',
              ),
            ),
          )
          .catch(() =>
            this.CucCloudMessage.error(
              this.$translate.instant(
                'vps_backup_storage_access_forgot_password_failure',
              ),
            ),
          )
          .finally(() => this.$uibModalInstance.close()),
    });
    return this.loader.load();
  }
}
