import get from 'lodash/get';

import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsSettingsCreateSecurityGroupCtrl {
  /* @ngInject */
  constructor($translate, enterpriseCloudDatabaseService) {
    this.$translate = $translate;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
  }

  $onInit() {
    this.loaders = {
      securityGroup: false,
    };
    this.data = {
      securityGroupName: '',
    };
  }

  createSecurityGroup() {
    this.loaders.securityGroup = true;
    this.enterpriseCloudDatabaseService
      .createSecurityGroup(this.clusterId, this.data.securityGroupName)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'enterprise_cloud_database_service_details_settings_create_security_group_success',
          ),
          STATUS.SUCCESS,
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'enterprise_cloud_database_service_details_settings_create_security_group_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          STATUS.ERROR,
        ),
      )
      .finally(() => {
        this.loaders.securityGroup = false;
      });
  }

  securityGroupNameChanged(data) {
    Object.assign(this.data, data);
  }
}
