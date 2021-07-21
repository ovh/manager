export default class KycIdentitySummaryUpdateBankAccountController {
  /* @ngInject */
  constructor(
    $uibModalInstance,
    ovhPaymentMethodHelper,
    bankAccount,
    updateBankAccount,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.bankAccount = bankAccount;
    this.updateBankAccount = updateBankAccount;
    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
  }

  confirm() {
    this.errorMessage = undefined;

    if (!this.form.$invalid) {
      this.isLoading = true;
      this.updateBankAccount(this.iban)
        .then((data) => {
          this.$uibModalInstance.close(data);
        })
        .catch(({ data: error }) => {
          this.errorMessage = error.message;
          this.isLoading = false;
        });
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}
