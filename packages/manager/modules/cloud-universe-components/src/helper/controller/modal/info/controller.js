export default class CucInfoModalController {
  /* @ngInject */
  constructor($translate, $uibModalInstance, params) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.params = params;
  }

  $onInit() {
    this.okButtonText =
      this.params.okButtonText ||
      this.$translate.instant('cuc_helper_modal_ok');
    this.cancelButtonText =
      this.params.cancelButtonText ||
      this.$translate.instant('cuc_helper_cancel');
  }

  dismissModal() {
    this.$uibModalInstance.dismiss();
  }

  closeModal() {
    this.$uibModalInstance.close();
  }
}
