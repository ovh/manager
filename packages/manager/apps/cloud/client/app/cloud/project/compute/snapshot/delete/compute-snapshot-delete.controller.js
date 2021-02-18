(() => {
  class CloudProjectComputeSnapshotDeleteCtrl {
    constructor(
      $uibModalInstance,
      serviceName,
      snapshot,
      OvhApiCloudProjectSnapshot,
      OvhApiCloudProjectVolumeSnapshot,
    ) {
      this.$uibModalInstance = $uibModalInstance;
      this.serviceName = serviceName;
      this.snapshot = snapshot;
      this.OvhApiCloudProjectVolumeSnapshot = OvhApiCloudProjectVolumeSnapshot;
      this.OvhApiCloudProjectSnapshot = OvhApiCloudProjectSnapshot;

      this.loaders = {
        delete: false,
      };
    }

    deleteSnapshot(snapshotId) {
      return this.OvhApiCloudProjectSnapshot.v6().remove({
        serviceName: this.serviceName,
        snapshotId,
      }).$promise;
    }

    deleteVolumeSnapshot(snapshotId) {
      return this.OvhApiCloudProjectVolumeSnapshot.v6().delete({
        serviceName: this.serviceName,
        snapshotId,
      }).$promise;
    }

    confirm() {
      this.loaders.delete = true;
      const promiseDelete =
        this.snapshot.type === 'volume'
          ? this.deleteVolumeSnapshot(this.snapshot.id)
          : this.deleteSnapshot(this.snapshot.id);
      promiseDelete
        .then((response) => this.$uibModalInstance.close(response))
        .catch((err) => this.$uibModalInstance.dismiss(err))
        .finally(() => {
          this.loaders.delete = false;
        });
    }

    cancel() {
      this.$uibModalInstance.dismiss();
    }
  }

  angular
    .module('managerApp')
    .controller(
      'CloudProjectComputeSnapshotDeleteCtrl',
      CloudProjectComputeSnapshotDeleteCtrl,
    );
})();
