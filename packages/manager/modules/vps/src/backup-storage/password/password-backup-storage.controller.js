export default class PasswordBackupStorageCtrl {
  /* @ngInject */
  constructor($translate, CucControllerHelper, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
  }

  cancel() {
    return this.goBack();
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
          .finally(() => this.cancel()),
    });
    return this.loader.load();
  }
}
