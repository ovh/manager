import get from 'lodash/get';
import pick from 'lodash/pick';

export default class {
  /* @ngInject */
  constructor($translate, Alerter, dedicatedCloudDatacenterBackupService) {
    this.$translate = $translate;
    this.alerter = Alerter;
    this.dedicatedCloudDatacenterBackupService = dedicatedCloudDatacenterBackupService;
  }

  $onInit() {
    this.actualOffer = this.backup.backupOffer;
    this.alertMain = 'app.dedicatedClouds.datacenter.backup';
    this.loader = {
      updatingCapabilities: false,
    };
  }

  updateBackupCapabilities() {
    if (!this.backup.isActive()) {
      return null;
    }
    this.loader.updatingCapabilities = true;
    return this.dedicatedCloudDatacenterBackupService
      .updateBackupCapabilities(
        this.productId,
        this.datacenterId,
        pick(this.backup, [
          'backupDurationInReport',
          'backupSizeInReport',
          'diskSizeInReport',
          'fullDayInReport',
          'restorePointInReport',
          'mailAddress',
          'backupOffer',
        ]),
      )
      .then(() => {
        let message = this.$translate.instant(
          'dedicatedCloud_datacenter_backup_capability_update_success',
        );
        if (this.backup.mailAddress) {
          message = `${message} ${this.$translate.instant(
            'dedicatedCloud_datacenter_backup_capability_update_email_success',
            {
              emailAddress: this.backup.mailAddress,
            },
          )}`;
        }
        this.alerter.success(message, this.alertMain);
      })
      .catch((error) => {
        this.alerter.error(
          this.$translate.instant(
            'dedicatedCloud_datacenter_backup_capability_update_error',
            {
              message: get(error, ['data', 'message'], error.message),
            },
          ),
          this.alertMain,
        );
      })
      .finally(() => {
        this.loader.updatingCapabilities = false;
        this.scrollToTop();
      });
  }
}
