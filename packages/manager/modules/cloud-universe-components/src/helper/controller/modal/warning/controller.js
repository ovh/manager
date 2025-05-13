export default class CucWarningModalController {
  /* @ngInject */
  constructor($uibModalInstance, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.params = params;
  }

  dismissModal() {
    this.$uibModalInstance.dismiss();
  }

  closeModal() {
    this.$uibModalInstance.close();
  }
}
