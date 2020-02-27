import get from 'lodash/get';

import { BACKUP_STATE_REMOVING } from '../backup.constants';

export default class {
  /* @ngInject */
  constructor($translate, Alerter, datacenterBackupService) {
    this.$translate = $translate;
    this.alerter = Alerter;
    this.datacenterBackupService = datacenterBackupService;
  }

  $onInit() {
    this.deleting = false;
  }

  delete() {
    if (!this.backup.isActive()) {
      return null;
    }
    this.deleting = true;
    return this.datacenterBackupService
      .disableBackup(this.productId, this.datacenterId)
      .then(() => {
        this.backup.setState(BACKUP_STATE_REMOVING);
        return this.goToBackup(
          this.$translate.instant('datacenter_backup_delete_success'),
          'success',
        );
      })
      .catch((error) => {
        return this.goToBackup(
          this.$translate.instant('datacenter_backup_delete_error', {
            message: get(error, ['data', 'message'], error.message),
          }),
          'error',
        );
      })
      .finally(() => {
        this.deleting = false;
      });
  }
}
