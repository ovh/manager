export default class NashaPartitionCustomSnapshotAddCtrl {
  /* @ngInject */ /* eslint-disable max-len */
  constructor($scope, $stateParams, $translate, $uibModalInstance, OvhApiDedicatedNashaPartition, CucCloudMessage) {
    const self = this;

    self.saving = false;

    self.data = {
      partition: $scope.$resolve.items,
      customSnapshot: {
        prefix: 'snap-',
      },
    };

    self.options = {
      snapshotName: {
        maxLength: 70,
      },
    };

    self.snapshotName = '';

    function computeDefaultSnapshotName() {
      const currentDate = new Date();
      const timeZonedDate = new Date(currentDate.getTime()
        - (currentDate.getTimezoneOffset() * 60000));
      const dateString = timeZonedDate.toISOString();
      self.snapshotName = `${self.data.partition.partitionName}-${dateString}`;
    }

    function init() {
      computeDefaultSnapshotName();
    }

    self.addCustomSnapshot = function addCustomSnapshot() {
      self.saving = true;
      OvhApiDedicatedNashaPartition.CustomSnapshot().v6().add({
        serviceName: $stateParams.nashaId,
        partitionName: self.data.partition.partitionName,
      }, {
        name: self.snapshotName,
      }).$promise.then((result) => {
        $uibModalInstance.close({ partition: self.data.partition, tasks: [result.data.taskId] });
        CucCloudMessage.success($translate.instant('nasha_custom_snapshot_modal_success'));
      }).catch(() => {
        $uibModalInstance.dismiss();
        CucCloudMessage.error($translate.instant('nasha_custom_snapshot_modal_fail'));
      }).finally(() => {
        self.saving = false;
      });
    };

    self.dismiss = function dismiss() {
      $uibModalInstance.dismiss();
    };

    init();
  }
}
