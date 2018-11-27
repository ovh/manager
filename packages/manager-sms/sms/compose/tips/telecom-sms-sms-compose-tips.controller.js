export default /* @ngInject */ class TelecomSmsSmsComposeTipsCtrl {
  constructor($uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
