export default class IdentityCheckFormConfirmCtrl {
  /* @ngInject */
  constructor(atInternet, $uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
    this.atInternet = atInternet;
  }

  confirm() {
    this.trackClick('confirm');
    this.$uibModalInstance.close();
  }

  cancel() {
    this.trackClick('cancel');
    this.$uibModalInstance.dismiss();
  }

  trackClick(nameClick) {
    this.atInternet.trackClick({
      name: `telecom::telephony::account-validation::cancel-validation-popup::${nameClick}`,
      type: 'action',
    });
  }
}
