import get from 'lodash/get';

import { BACKUP_OFFER_NAME, BACKUP_STATE_REMOVING } from '../backup.constants';

export default class {
  /* @ngInject */
  constructor($translate, Alerter, dedicatedCloudDatacenterBackupService) {
    this.$translate = $translate;
    this.alerter = Alerter;
    this.dedicatedCloudDatacenterBackupService = dedicatedCloudDatacenterBackupService;
  }

  $onInit() {
    this.deleting = false;
  }

  delete() {
    if (!this.backup.isActive()) {
      return null;
    }
    this.deleting = true;
    return this.dedicatedCloudDatacenterBackupService
      .disableBackup(this.productId, this.datacenterId)
      .then(() => {
        this.backup.state = BACKUP_STATE_REMOVING;
        return this.goToBackup(
          this.$translate.instant(
            'dedicatedCloud_datacenter_backup_delete_success',
            { name: get(BACKUP_OFFER_NAME, this.backup.backupOffer) },
          ),
          'success',
        );
      })
      .catch((error) => {
        return this.goToBackup(
          this.$translate.instant(
            error.status === 403
              ? 'dedicatedCloud_datacenter_backup_delete_error_403'
              : 'dedicatedCloud_datacenter_backup_delete_error',
            {
              message: get(error, ['data', 'message'], error.message),
            },
          ),
          'danger',
        );
      })
      .finally(() => {
        this.deleting = false;
      });
  }
}
