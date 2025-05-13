export default /* @ngInject */ class telecomXdslModemDhcpModal {
  /* @ngInject */
  constructor($uibModalInstance, messageIps) {
    this.$uibModalInstance = $uibModalInstance;
    this.messageIps = messageIps;
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
