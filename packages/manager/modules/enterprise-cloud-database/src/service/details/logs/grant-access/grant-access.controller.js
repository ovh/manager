import get from 'lodash/get';

import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsLogsGrantAccessCtrl {
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
    this.log = {
      username: null,
      note: null,
    };
  }

  grantAccess() {
    this.isLoading = true;
    this.enterpriseCloudDatabaseService.grantAccessToLdpAccount(this.clusterId, this.log)
      .then(() => this.goBackToLogs(this.$translate.instant('enterprise_cloud_database_service_details_logs_grant_access_success', { ldpName: this.log.username })))
      .catch((error) => this.goBackToLogs(
        this.$translate.instant('enterprise_cloud_database_service_details_logs_grant_access_error', {
          message: get(error, 'data.message'),
        }), STATUS.ERROR,
      ));
  }
}
