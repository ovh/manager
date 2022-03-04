export default class KycIdentitySummaryBankAccountController {
  /* @ngInject */
  constructor(ovhPaymentMethodHelper) {
    this.isOpenModal = false;
    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
  }

  $onInit() {
    this.isEditable = this.svaWallet.kycStatus !== 'BLOCKED';
    this.isLoading = false;
  }

  goToEditIban() {
    this.isOpenModal = true;
  }

  confirm() {
    this.errorMessage = undefined;

    this.isLoading = true;
    this.saveWalletIban(this.model)
      .then(() => {
        this.editMode = false;
        this.bankAccount = this.model;
        this.updateIbanSuccessMessage = true;
      })
      .catch(({ data: error }) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      });
  }

  cancel() {
    this.isOpenModal = false;
  }
}
