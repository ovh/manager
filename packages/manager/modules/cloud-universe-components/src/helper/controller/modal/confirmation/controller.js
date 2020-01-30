export default class CucConfirmationModalController {
  /* @ngInject */
  constructor($translate, $uibModalInstance, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.params = params;

    this.submitButtonText = this.params.submitButtonText
      ? this.params.submitButtonText
      : $translate.instant('cuc_helper_modal_ok');
    this.cancelButtonText = this.params.cancelButtonText
      ? this.params.cancelButtonText
      : $translate.instant('cuc_helper_cancel');
  }

  dismissModal() {
    this.$uibModalInstance.dismiss('cancel');
  }

  closeModal() {
    this.$uibModalInstance.close();
  }
}
