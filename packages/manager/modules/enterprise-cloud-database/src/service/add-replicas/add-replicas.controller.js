import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import min from 'lodash/min';
import range from 'lodash/range';

import { STATUS } from '../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceAddReplicasCtrl {
  /* @ngInject */
  constructor(
    $translate,
    enterpriseCloudDatabaseService,
  ) {
    this.$translate = $translate;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
  }

  $onInit() {
    const orderableReplicaCount = min([this.maxHostCount - this.hostList.length,
      this.availableReplicas]);
    const replicaCost = get(head(this.nodeCatalog.pricings), 'price');
    const tax = get(head(this.nodeCatalog.pricings), 'tax');
    this.replicaCounts = map(range(1, orderableReplicaCount + 1), (replicaNumber) => ({
      replicaNumber,
      text: `${replicaNumber} ${(replicaNumber > 1
        ? this.$translate.instant('enterprise_cloud_database_common_replicas')
        : this.$translate.instant('enterprise_cloud_database_common_replica'))}`,
      price: replicaCost * replicaNumber,
      tax: tax * replicaNumber,
    }));
    this.data = {
      selectedReplicaCount: head(this.replicaCounts),
    };
    this.isLoading = false;
  }

  saveData() {
    const data = {
      replicaCount: this.data.selectedReplicaCount.replicaNumber,
    };
    if (this.createReplicas) {
      this.isLoading = true;
      this.enterpriseCloudDatabaseService
        .orderAddons(this.clusterId, data.replicaCount)
        .then((order) => {
          this.enterpriseCloudDatabaseService.resetHostsCache();
          return this.goBack(this.$translate.instant('enterprise_cloud_database_service_add_replicas_success', {
            orderURL: this.orderUrl(order.orderId),
            replicaCount: data.replicaCount,
          }));
        })
        .catch((error) => this.goBack(this.$translate.instant('enterprise_cloud_database_service_add_replicas_error', {
          message: get(error, 'data.message'),
        }), STATUS.ERROR))
        .finally(() => {
          this.isLoading = false;
          if (this.callback) {
            this.callback(data);
          }
        });
    } else {
      if (this.callback) {
        this.callback(data);
      }
      this.goBack();
    }
  }

  defaultPaymentChange(defaultPaymentCheck) {
    this.defaultPaymentCheck = defaultPaymentCheck;
  }
}
