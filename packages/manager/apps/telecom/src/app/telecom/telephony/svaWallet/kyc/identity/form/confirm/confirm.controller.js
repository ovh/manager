export default class DeleteController {
  /* @ngInject */
  constructor($uibModalInstance, $translate) {
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
  }

  $onInit() {
    this.confirmationCode = this.$translate.instant(
      'telephony_billingAccount_svaWallet_kyc_identity_confirm_code',
    );
    this.confirmationPattern = new RegExp(`^${this.confirmationCode}$`);
  }

  confirm() {
    if (!this.form.$invalid) {
      this.$uibModalInstance.close();
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}
