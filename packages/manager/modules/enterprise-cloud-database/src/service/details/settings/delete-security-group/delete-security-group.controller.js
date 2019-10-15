import get from 'lodash/get';

import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsSettingsDeleteSecurityGroupCtrl {
  /* @ngInject */
  constructor(
    $translate,
    enterpriseCloudDatabaseService,
  ) {
    this.$translate = $translate;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
  }

  $onInit() {
    this.loaders = {
      securityGroup: false,
    };
  }

  deleteSecurityGroup() {
    this.loaders.securityGroup = true;
    this.enterpriseCloudDatabaseService
      .deleteSecurityGroup(this.clusterId, this.securityGroup.id)
      .then(() => this.goBack(
        this.$translate.instant('enterprise_cloud_database_service_details_settings_delete_security_group_success', {
          groupName: this.securityGroup.name,
        }),
        STATUS.SUCCESS,
      ))
      .catch(error => this.goBack(
        this.$translate.instant('enterprise_cloud_database_service_details_settings_delete_security_group_error', {
          message: get(error, 'data.message'),
        }),
        STATUS.ERROR,
      ))
      .finally(() => {
        this.loaders.securityGroup = false;
      });
  }
}
