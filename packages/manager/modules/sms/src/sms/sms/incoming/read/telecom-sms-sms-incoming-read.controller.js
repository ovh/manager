export default class {
  /* @ngInject */
  constructor($uibModalInstance, incomingSms) {
    this.$uibModalInstance = $uibModalInstance;
    this.incomingSms = incomingSms;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
