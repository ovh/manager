export default class {
  /* @ngInject */
  constructor($uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
