export default class NashaPartitionDeleteCtrl {
  /* @ngInject */ /* eslint-disable max-len */
  constructor(OvhApiDedicatedNasha, $stateParams, $scope, $uibModalInstance, $translate, CucCloudMessage) {
    const self = this;
    self.loading = false;
    self.data = {
      nashaId: $stateParams.nashaId,
      partition: $scope.$resolve.items,
    };

    self.deletePartition = function deletePartition() {
      self.loading = true;
      OvhApiDedicatedNasha.Partition().v6().delete({
        serviceName: self.data.nashaId,
        partitionName: self.data.partition.partitionName,
      }).$promise.then((result) => {
        $uibModalInstance.close({ partition: self.data.partition, tasks: [result.data.taskId] });
        CucCloudMessage.success($translate.instant('nasha_partitions_action_delete_success', { partitionName: self.data.partition.partitionName }));
      }).catch(() => {
        $uibModalInstance.dismiss();
        CucCloudMessage.error($translate.instant('nasha_partitions_action_delete_failure', { partitionName: self.data.partition.partitionName }));
      }).finally(() => {
        self.loading = false;
      });
    };

    self.dismiss = function dismiss() {
      $uibModalInstance.dismiss();
    };
  }
}
