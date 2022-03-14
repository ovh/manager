export default class KycIdentitySummaryBankAccountController {
  /* @ngInject */
  constructor(ovhPaymentMethodHelper) {
    this.isOpenModal = false;
    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
  }

  $onInit() {
    this.isEditable = this.svaWallet.kycStatus !== 'BLOCKED';
    this.isLoading = false;
    this.model = {
      holder: null,
      iban: null,
    };
  }

  goToEditIban() {
    this.isOpenModal = true;
  }

  confirm() {
    this.errorMessage = null;

    this.isLoading = true;
    this.saveWalletIban(this.model)
      .then(() => {
        this.isOpenModal = false;
        this.bankAccount = this.model;
        this.updateIbanSuccessMessage = true;
      })
      .catch(({ data: error }) => {
        this.errorMessage = error.message;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.isOpenModal = false;
  }
}
