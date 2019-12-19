import get from 'lodash/get';
import {
  ENTERPRISE_CLOUD_DATABASE_CLUSTER_NAME_PATTERN,
} from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsOverviewUpdateNameCtrl {
  /* @ngInject */
  constructor(
    $translate,
    enterpriseCloudDatabaseService,
  ) {
    this.$translate = $translate;
    this.service = enterpriseCloudDatabaseService;
    this.CLUSTER_NAME_PATTERN = ENTERPRISE_CLOUD_DATABASE_CLUSTER_NAME_PATTERN;
  }

  $onInit() {
    this.name = this.clusterDetails.name;
  }

  changeName() {
    this.isLoading = true;
    return this.service.setClusterDetails(this.clusterId, { name: this.name })
      .then((res) => this.goToOverview(
        this.$translate.instant('enterprise_cloud_database_name_change_success'),
        'success',
        res.id,
      ))
      .catch((error) => this.goToOverview(
        this.$translate.instant('enterprise_cloud_database_name_change_error', {
          message: get(error, 'data.message'),
        }),
        'error',
      ))
      .finally(() => { this.isLoading = false; });
  }
}
