import get from 'lodash/get';

export default class NashaPartitionDeleteCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    CucCloudMessage,
    OvhApiDedicatedNasha,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
    this.loading = false;
  }

  $onInit() {
    this.data = {
      nashaId: this.serviceName,
      partition: this.partition,
    };
  }

  deletePartition() {
    this.loading = true;
    this.OvhApiDedicatedNasha.Partition().v6().delete({
      serviceName: this.data.nashaId,
      partitionName: this.data.partition.partitionName,
    }).$promise.then((result) => {
      this.goToPartitionPage(
        this.$translate.instant('nasha_partitions_action_delete_success', {
          partitionName: this.data.partition.partitionName,
        }),
        'success',
        {
          partition: this.data.partition,
          tasks: [result.data.taskId],
        },
      );
    })
      .catch(error => this.goToPartitionPage(
        this.$translate.instant('nasha_partitions_action_delete_failure', {
          partitionName: this.data.partition.partitionName,
          message: get(error, 'data.message'),
        }),
        'error',
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  dismiss() {
    this.goToPartitionPage();
  }
}
