export default class {
  /* @ngInject */
  constructor($uibModalInstance, pendingSms) {
    this.$uibModalInstance = $uibModalInstance;
    this.pendingSms = pendingSms;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
