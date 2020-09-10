import get from 'lodash/get';

import { BACKUP_OFFER_NAME } from './backup.constants';

export default class {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    Alerter,
    dedicatedCloudDatacenterBackupService,
  ) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.dedicatedCloudDatacenterBackupService = dedicatedCloudDatacenterBackupService;
  }

  $onInit() {
    this.actualOffer = this.backup.backupOffer;
    this.alertMain = 'datacenterBackup';
    this.loader = {
      updatingCapabilities: false,
    };
    this.$timeout(() => this.createProgressAlert());
  }

  createProgressAlert() {
    if (this.backup.isProcessing()) {
      this.alerter.success(
        this.$translate.instant(
          `dedicatedCloud_datacenter_backup_state_${this.backup.state}`,
          {
            operationsUrl: this.operationsUrl,
            name: get(BACKUP_OFFER_NAME, this.backup.backupOffer),
          },
        ),
        this.alertMain,
      );
    }
  }

  updateBackupCapabilities() {
    if (!this.backup.isActive()) {
      return null;
    }
    this.loader.updatingCapabilities = true;
    return this.dedicatedCloudDatacenterBackupService
      .updateBackupCapabilities(this.productId, this.datacenterId, this.backup)
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
