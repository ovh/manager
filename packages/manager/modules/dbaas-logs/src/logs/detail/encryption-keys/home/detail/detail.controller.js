export default class LogsEncryptionKeysDetailCtrl {
  /* @ngInject */
  constructor($uibModalInstance, encryptionKey) {
    this.$uibModalInstance = $uibModalInstance;
    this.encryptionKey = encryptionKey;
  }

  formatCreationDate() {
    return moment(this.encryptionKey.createdAt).format('YYYY-MM-DDTHH:mm:ssZ');
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}
