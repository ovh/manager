import get from 'lodash/get';

import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsBackupsRestoreCtrl {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    enterpriseCloudDatabaseService,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.service = enterpriseCloudDatabaseService;
  }

  cancel() {
    this.$state.go('^');
  }

  restoreInstance() {
    this.isLoading = true;
    this.service.createRestore(this.backupInstance.clusterId, this.backupInstance.id)
      .then(res => this.goBackToBackups(
        this.$translate.instant('enterprise_cloud_database_backups_restore_success',
          { name: this.backupInstance.name }),
        STATUS.SUCCESS,
        res.id,
      ))
      .catch(error => this.goBackToBackups(
        this.$translate.instant('enterprise_cloud_database_backups_restore_error', {
          message: get(error, 'data.message'),
        }),
        STATUS.ERROR,
      ))
      .finally(() => { this.isLoading = false; });
  }
}
