export default class IdentityCheckFormConfirmCtrl {
  /* @ngInject */
  constructor($uibModalInstance, atInternet) {
    this.$uibModalInstance = $uibModalInstance;
    this.atInternet = atInternet;
  }

  confirm() {
    this.trackClick('cancel-validation-popup::confirm');
    this.$uibModalInstance.close();
  }

  cancel() {
    this.trackClick('cancel-validation-popup::cancel');
    this.$uibModalInstance.dismiss();
  }

  trackClick(nameClick) {
    this.atInternet.trackClick({
      name: `telecom::telephony::account-validation::${nameClick}`,
      type: 'action',
    });
  }
}
