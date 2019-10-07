import get from 'lodash/get';

import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseDeleteCtrl {
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

  $onInit() {
    this.isLoading = false;
  }

  deleteInstance() {
    this.isLoading = true;
    return this.service.deleteBackupInstance(this.backupInstance.clusterId, this.backupInstance.id)
      .then(res => this.goBackToBackups(
        this.$translate.instant('enterprise_cloud_database_backups_delete_success',
          { name: this.backupInstance.name }),
        STATUS.SUCCESS,
        res.id,
      ))
      .catch(error => this.goBackToBackups(
        this.$translate.instant('enterprise_cloud_database_backups_delete_error', {
          message: get(error, 'data.message'),
        }),
        STATUS.ERROR,
      ))
      .finally(() => { this.isLoading = false; });
  }

  cancel() {
    this.$state.go('^');
  }
}
