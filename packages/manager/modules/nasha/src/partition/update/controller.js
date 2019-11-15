export default class NashaPartitionUpdateCtrl {
  /* @ngInject */ /* eslint-disable max-len */
  constructor($stateParams, $scope, $uibModalInstance, $translate, OvhApiDedicatedNasha, CucCloudMessage) {
    const self = this;
    self.loading = false;

    self.data = {
      nashaId: $stateParams.nashaId,
      partition: $scope.$resolve.items,
      newSize: $scope.$resolve.items.size,
    };

    self.isSizeChanged = function isSizeChanged() {
      return $scope.$resolve.items.size !== self.data.newSize;
    };

    self.checkSize = function checkSize() {
      if (self.data.newSize) {
        self.data.newSize = parseInt(self.data.newSize.toString().replace('.', ''), 10);
      }
    };

    function getTasksTodo(operation) {
      return OvhApiDedicatedNasha.Task().v6().query({
        operation,
        serviceName: self.data.nashaId,
        status: 'todo',
      });
    }

    function getTaskInTodoAndClose() {
      getTasksTodo('clusterLeclercPartitionUpdate')
        .$promise.then((tasks) => {
          $uibModalInstance.close({ partition: self.data.partition, tasks });
        });
    }

    self.updatePartition = function updatePartition() {
      self.loading = true;
      OvhApiDedicatedNasha.Partition().v6().update({
        serviceName: self.data.nashaId,
      }, {
        partitionName: self.data.partition.partitionName,
        size: self.data.newSize,
      }).$promise.then(() => {
        getTaskInTodoAndClose();
        CucCloudMessage.success($translate.instant('nasha_partitions_action_update_success', { partitionName: self.data.partition.partitionName }));
      }).catch(() => {
        $uibModalInstance.dismiss();
        CucCloudMessage.error($translate.instant('nasha_partitions_action_update_failure', { partitionName: self.data.partition.partitionName }));
      }).finally(() => {
        self.loading = false;
      });
    };

    self.dismiss = function dismiss() {
      $uibModalInstance.dismiss();
    };
  }
}
