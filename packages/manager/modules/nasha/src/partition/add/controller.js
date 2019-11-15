export default class NashaPartitionAddCtrl {
  /* @ngInject */ /* eslint-disable max-len */
  constructor($stateParams, $scope, $q, $uibModalInstance, $translate, OvhApiDedicatedNasha, CucCloudMessage) {
    const self = this;

    self.nasha = null;
    self.protocols = [];
    self.protocols = null;
    self.loading = false;

    self.newPartition = {
      partitionName: null,
      size: 10,
      protocol: null,
    };

    self.error = {
      name: false,
    };

    self.namePattern = /^[A-Za-z0-9]{1,20}$/;

    self.isPartitionValid = function isPartitionValid() {
      return self.newPartition.partitionName // Partition name is set
        && self.newPartition.size // partition size is set
        && self.newPartition.protocol // protocol is set
        && self.newPartition.size >= 10 // partition size is minimum 10 GB
        // partition size is less or equal than the maax returned by the pi
        && self.newPartition.size <= self.nasha.zpoolSize;
    };

    self.addPartition = function addPartition() {
      self.loading = true;
      OvhApiDedicatedNasha.Partition().v6().create({
        serviceName: self.nasha.serviceName,
      }, {
        partitionName: self.newPartition.partitionName,
        protocol: self.newPartition.protocol,
        size: self.newPartition.size,
      }).$promise.then((result) => {
        $uibModalInstance.close({
          partition: self.newPartition,
          tasks: [result.data.taskId],
          isNew: true,
        });
        CucCloudMessage.success($translate.instant('nasha_partitions_action_add_success', { partitionName: self.newPartition.name }));
      }).catch(() => {
        $uibModalInstance.dismiss();
        CucCloudMessage.error($translate.instant('nasha_partitions_action_add_failure', { partitionName: self.newPartition.name }));
      }).finally(() => {
        self.loading = false;
      });
    };

    self.dismiss = function dismiss() {
      $uibModalInstance.dismiss();
    };

    function init() {
      self.loading = true;
      $q.all({
        nasha: OvhApiDedicatedNasha.v6().get({ serviceName: $stateParams.nashaId }).$promise,
        schema: OvhApiDedicatedNasha.v6().schema().$promise,
      }).then((data) => {
        self.protocols = data.schema.models['dedicated.storage.ProtocolEnum'].enum;
        self.nasha = data.nasha;
      }).finally(() => {
        self.loading = false;
      });
    }

    init();
  }
}
