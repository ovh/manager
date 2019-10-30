export default class EasterEggsModalController {
  /* @ngInject */
  constructor($uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
  }

  activate() {
    return this.cancel(true);
  }

  cancel(result = null) {
    return this.$uibModalInstance.close(result);
  }

  onDismiss() {
    return this.cancel();
  }
}
