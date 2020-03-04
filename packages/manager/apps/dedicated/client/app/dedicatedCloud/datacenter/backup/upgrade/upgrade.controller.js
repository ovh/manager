import find from 'lodash/find';
import get from 'lodash/get';
import pick from 'lodash/pick';

import { MODES } from '../components/termsOfUse/terms-of-use.constants';
import { BACKUP_NAME } from './upgrade.constants';

export default class {
  /* @ngInject */
  constructor($translate, dedicatedCloudDatacenterBackupService) {
    this.$translate = $translate;
    this.dedicatedCloudDatacenterBackupService = dedicatedCloudDatacenterBackupService;
    this.MODES = MODES;
    this.BACKUP_NAME = BACKUP_NAME;
  }

  $onInit() {
    this.upgrading = false;
    if (this.backup && this.backup.backupOffer) {
      this.selectedOffer = find(this.backupOffers, {
        offerName: this.backup.backupOffer,
      });
    }
    this.conditionsAccepted = false;
  }

  upgrade() {
    this.upgrading = true;
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
      .then(() =>
        this.goToBackup(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_backup_upgrade_success_1',
            { offer: this.backup.backupOffer },
          )} ${this.$translate.instant(
            'dedicatedCloud_datacenter_backup_upgrade_success_2',
          )}`,
        ),
      )
      .catch((error) => {
        return this.goToBackup(
          this.$translate.instant(
            'dedicatedCloud_datacenter_backup_upgrade_error',
            {
              message: get(error, ['data', 'message'], error.message),
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.upgrading = false;
      });
  }
}
