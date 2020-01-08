class CloudProjectComputeSshDeleteCtrl {
  constructor(
    $uibModalInstance,
    OvhApiCloudProjectSshKey,
    serviceName,
    sshKey,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;

    this.serviceName = serviceName;
    this.sshKey = sshKey;

    this.loaders = {
      delete: false,
    };
  }

  deleteSshKey(sshKey) {
    return this.OvhApiCloudProjectSshKey.v6().remove({
      serviceName: this.serviceName,
      keyId: sshKey.id,
    }).$promise;
  }

  confirm() {
    this.loaders.delete = true;
    return this.deleteSshKey(this.sshKey)
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
    'CloudProjectComputeSshDeleteCtrl',
    CloudProjectComputeSshDeleteCtrl,
  );
