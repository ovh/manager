import get from 'lodash/get';

export default class NashaPartitionUpdateCtrl {
  /* @ngInject */
  constructor($scope, $translate, CucCloudMessage, OvhApiDedicatedNasha) {
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
      newSize: this.partition.size,
    };
  }

  getTasksTodo(operation) {
    return this.OvhApiDedicatedNasha.Task().v6().query({
      operation,
      serviceName: this.data.nashaId,
      status: 'todo',
    });
  }

  isSizeChanged() {
    return this.$scope.$resolve.items.size !== this.data.newSize;
  }

  checkSize() {
    if (this.data.newSize) {
      this.data.newSize = parseInt(
        this.data.newSize.toString().replace('.', ''),
        10,
      );
    }
  }

  getTaskInTodoAndClose() {
    this.getTasksTodo('clusterLeclercPartitionUpdate').$promise.then(
      (tasks) => {
        this.goToPartitionPage(
          this.$translate.instant('nasha_partitions_action_update_success', {
            partitionName: this.data.partition.partitionName,
          }),
          'success',
          {
            partition: this.data.partition,
            tasks,
          },
        );
      },
    );
  }

  updatePartition() {
    this.loading = true;
    this.OvhApiDedicatedNasha.Partition()
      .v6()
      .update(
        {
          serviceName: this.data.nashaId,
        },
        {
          partitionName: this.data.partition.partitionName,
          size: this.data.newSize,
        },
      )
      .$promise.then(() => {
        this.getTaskInTodoAndClose();
      })
      .catch((error) => {
        this.goToPartitionPage(
          this.$translate.instant('nasha_partitions_action_update_failure', {
            partitionName: this.data.partition.partitionName,
            message: get(error, 'data.message'),
          }),
          'error',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  dismiss() {
    this.goToPartitionPage();
  }
}
