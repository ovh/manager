class CloudProjectComputeVolumeDeleteCtrl {
  constructor(
    $uibModalInstance,
    OvhApiCloudProjectVolume,
    serviceName,
    volume,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.OvhApiCloudProjectVolume = OvhApiCloudProjectVolume;

    this.serviceName = serviceName;
    this.volume = volume;

    this.loaders = {
      delete: false,
    };
  }

  deleteVolume(volumeId) {
    return this.OvhApiCloudProjectVolume.v6().remove({
      serviceName: this.serviceName,
      volumeId,
    }).$promise;
  }

  confirm() {
    this.loaders.delete = true;
    return this.deleteVolume(this.volume.id)
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
    'CloudProjectComputeVolumeDeleteCtrl',
    CloudProjectComputeVolumeDeleteCtrl,
  );
