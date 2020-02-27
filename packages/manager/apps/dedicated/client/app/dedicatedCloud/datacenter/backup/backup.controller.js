import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $anchorScroll,
    $location,
    $translate,
    Alerter,
    datacenterBackupService,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.$location = $location;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.datacenterBackupService = datacenterBackupService;
  }

  $onInit() {
    this.alertMain = 'app.dedicatedClouds.datacenter.backup';
    this.loader = {
      updatingCapabilities: false,
    };
  }

  scrollToTop() {
    this.$location.hash('backupMainAlert');
    this.$anchorScroll();
  }

  updateBackupCapabilities() {
    if (!this.backup.isActive()) {
      return;
    }
    this.loader.updatingCapabilities = true;
    const capabilities = {
      backupDurationInReport: this.backup.backupDurationInReport,
      backupSizeInReport: this.backup.backupSizeInReport,
      diskSizeInReport: this.backup.diskSizeInReport,
      fullDayInReport: this.backup.fullDayInReport,
      restorePointInReport: this.backup.restorePointInReport,
      mailAddress: this.backup.mailAddress,
      backupOffer: this.backup.backupOffer,
    };
    this.datacenterBackupService
      .updateBackupCapabilities(this.productId, this.datacenterId, capabilities)
      .then(() => {
        let message = this.$translate.instant(
          'datacenter_backup_capability_update_success',
        );
        if (this.backup.mailAddress) {
          message = `${message} ${this.$translate.instant(
            'datacenter_backup_capability_update_email_success',
            {
              emailAddress: this.backup.mailAddress,
            },
          )}`;
        }
        this.alerter.success(message, this.alertMain);
      })
      .catch((error) => {
        this.alerter.error(
          this.$translate.instant('datacenter_backup_capability_update_error', {
            message: get(error, ['data', 'message'], error.message),
          }),
          this.alertMain,
        );
      })
      .finally(() => {
        this.loader.updatingCapabilities = false;
        this.scrollToTop();
      });
  }
}
