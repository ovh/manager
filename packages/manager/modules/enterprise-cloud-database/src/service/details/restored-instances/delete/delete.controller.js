import get from 'lodash/get';

import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseDeleteCtrl {
  /* @ngInject */
  constructor($state, $translate, enterpriseCloudDatabaseService) {
    this.$state = $state;
    this.$translate = $translate;
    this.service = enterpriseCloudDatabaseService;
    this.isLoading = false;
  }

  goBack() {
    return this.$state.go('^');
  }

  deleteInstance() {
    this.isLoading = true;
    return this.service
      .deleteRestoredInstance(this.clusterId, this.instanceId)
      .then((res) =>
        this.goBack(
          this.$translate.instant(
            'enterprise_cloud_database_restored_instance_delete_success',
            { instanceId: this.instanceId },
          ),
          STATUS.SUCCESS,
          res.id,
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'enterprise_cloud_database_restored_instance_delete_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          STATUS.ERROR,
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
