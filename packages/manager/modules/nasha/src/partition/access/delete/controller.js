export default class NashaPartitionAccessDeleteCtrl {
  /* @ngInject */
  constructor($scope, $translate, $uibModalInstance, OvhApiDedicatedNasha, CucCloudMessage) {
    const self = this;
    self.loading = false;
    self.toRemove = {
      serviceName: $scope.$resolve.items.serviceName,
      partitionName: $scope.$resolve.items.partitionName,
      access: $scope.$resolve.items.access,
    };

    self.removeAccess = function removeAccess() {
      self.loading = true;
      OvhApiDedicatedNasha.Partition().Access().v6().remove({
        serviceName: self.toRemove.serviceName,
        partitionName: self.toRemove.partitionName,
        ip: self.toRemove.access.ip,
      }).$promise.then((result) => {
        $uibModalInstance.close({ access: self.toRemove.access, task: result.data.taskId });
        CucCloudMessage.success($translate.instant('nasha_access_action_delete_success', { accessIp: self.toRemove.access.ip }));
      }).catch(() => {
        $uibModalInstance.dismiss();
        CucCloudMessage.error($translate.instant('nasha_access_action_delete_failure', { accessIp: self.toRemove.access.ip }));
      }).finally(() => {
        self.loading = false;
      });
    };

    self.dismiss = function dismiss() {
      $uibModalInstance.dismiss();
    };
  }
}
