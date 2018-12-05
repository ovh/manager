export default class {
  /* @ngInject */
  constructor($uibModalInstance, outgoingSms, outgoingSmsHlr) {
    this.$uibModalInstance = $uibModalInstance;
    this.outgoingSms = outgoingSms;
    this.outgoingSmsHlr = outgoingSmsHlr;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
