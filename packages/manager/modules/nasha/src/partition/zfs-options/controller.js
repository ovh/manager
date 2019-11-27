export default class NashaPartitionZFSOptionsCtrl {
  /* @ngInject */
  constructor($uibModalInstance, $filter, $q, $stateParams, $scope,
    $translate, CucCloudMessage, OvhApiDedicatedNasha, NashaPartitionZFSOptionsService) {
    const self = this;

    self.enums = {};
    self.states = {
      saving: false,
    };
    self.data = {
      partition: $scope.$resolve.items,
    };
    self.model = {};

    self.dismiss = function dismiss() {
      $uibModalInstance.dismiss();
    };

    self.applyZFSOptionsChanges = function applyZFSOptionsChanges() {
      self.states.saving = true;
      OvhApiDedicatedNasha.Partition().Options().v6().save({
        serviceName: $stateParams.nashaId,
        partitionName: self.data.partition.partitionName,
      }, {
        atime: self.model.atime ? 'on' : 'off',
        recordsize: self.model.recordsize,
        sync: self.model.sync,
      }).$promise
        .then((result) => {
          $uibModalInstance.close({ partition: self.data.partition, tasks: [result.data.taskId] });
          CucCloudMessage.success($translate.instant('nasha_partitions_zfs_modal_success'));
        })
        .catch(() => {
          self.dismiss();
          CucCloudMessage.error($translate.instant('nasha_partitions_zfs_modal_fail'));
        })
        .finally(() => {
          self.states.saving = false;
        });
    };

    self.$onInit = function $onInit() {
      self.loaders = true;
      self.data.partition = $scope.$resolve.items;
      NashaPartitionZFSOptionsService.getZFSOptionsEnums()
        .then((enums) => {
          self.enums = enums;
          return NashaPartitionZFSOptionsService
            .getCurrentZFSOptions($stateParams.nashaId, self.data.partition.partitionName);
        })
        .then((options) => {
          self.model = options;
        })
        .catch(() => {
          self.dismiss();
          CucCloudMessage.error($translate.instant('nasha_partitions_zfs_modal_loading_fail'));
        })
        .finally(() => {
          self.loaders = false;
        });
    };
  }
}
