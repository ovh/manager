export default class {
  /* @ngInject */
  constructor($uibModalInstance, publicCloudName, publicCloudId, quotas) {
    this.$uibModalInstance = $uibModalInstance;
    this.publicCloudName = publicCloudName;
    this.publicCloudId = publicCloudId;
    this.quotas = quotas;
  }

  dismissModal() {
    this.$uibModalInstance.dismiss('cancel');
  }

  closeModal() {
    this.$uibModalInstance.close();
  }
}
