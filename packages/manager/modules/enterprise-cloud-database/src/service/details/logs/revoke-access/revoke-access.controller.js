import get from 'lodash/get';

import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsLogsRevokeAccessCtrl {
  /* @ngInject */
  constructor(
    $translate,
    enterpriseCloudDatabaseService,
  ) {
    this.$translate = $translate;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
  }

  $onInit() {
    this.isLoading = false;
  }

  revokeAccess() {
    this.isLoading = true;
    this.enterpriseCloudDatabaseService.revokeAccessToLdpAccount(this.clusterId, this.ldpAccount.id)
      .then(() => this.goBackToLogs(this.$translate.instant('enterprise_cloud_database_service_details_logs_revoke_access_success', { ldpName: this.ldpAccount.username })))
      .catch((error) => this.goBackToLogs(
        this.$translate.instant('enterprise_cloud_database_service_details_logs_revoke_access_error', {
          message: get(error, 'data.message'),
        }), STATUS.ERROR,
      ));
  }
}
