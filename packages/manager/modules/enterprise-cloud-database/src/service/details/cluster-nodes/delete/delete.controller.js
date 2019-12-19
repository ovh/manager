import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import range from 'lodash/range';

import { DELETE_CONFIRMATION_INPUT_PATTERN, STATUS } from '../../../../enterprise-cloud-database.constants';
import { INCLUDED_CLUSTER_SIZE } from '../../../service.constants';

export default class EnterpriseCloudDatabaseServiceDetailsClusterSizeDeleteCtrl {
  /* @ngInject */
  constructor(
    $translate,
    enterpriseCloudDatabaseService,
  ) {
    this.$translate = $translate;
    this.DELETE_CONFIRMATION_INPUT_PATTERN = DELETE_CONFIRMATION_INPUT_PATTERN;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
    this.isLoading = false;
  }

  $onInit() {
    const additionalReplicaCount = this.hosts.length - (INCLUDED_CLUSTER_SIZE.PRIMARY
      + INCLUDED_CLUSTER_SIZE.REPLICA + INCLUDED_CLUSTER_SIZE.BACKUP);
    this.replicaCounts = map(range(1, additionalReplicaCount + 1), (replicaNumber) => ({
      replicaNumber,
      text: `${replicaNumber} ${(replicaNumber > 1
        ? this.$translate.instant('enterprise_cloud_database_common_replicas')
        : this.$translate.instant('enterprise_cloud_database_common_replica'))}`,
    }));
    this.selectedReplicaCount = head(this.replicaCounts);
  }

  deleteReplicas() {
    this.isLoading = true;
    this.enterpriseCloudDatabaseService
      .scaleCluster(this.clusterId, -this.selectedReplicaCount.replicaNumber)
      .then(() => {
        this.enterpriseCloudDatabaseService.resetHostsCache();
        return this.goBackToClusterSize(this.$translate.instant('enterprise_cloud_database_service_details_cluster_nodes_delete_success', {
          replicaCount: this.selectedReplicaCount.replicaNumber,
        }));
      })
      .catch((error) => this.goBackToClusterSize(this.$translate.instant('enterprise_cloud_database_service_details_cluster_nodes_delete_error', {
        message: get(error, 'data.message'),
      }), STATUS.ERROR))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
