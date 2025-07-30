export default class KycIdentitySummaryBankAccountController {
  /* @ngInject */
  constructor(ovhPaymentMethodHelper, $translate) {
    this.isOpenModal = false;
    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
    this.$translate = $translate;
  }

  $onInit() {
    this.isEditable = this.svaWallet.kycStatus !== 'BLOCKED';
    this.isLoading = false;
    this.model = {
      holder: null,
      iban: '',
    };
  }

  goToEditIban() {
    this.isOpenModal = true;
  }

  confirm() {
    this.errorMessage = null;

    this.isLoading = true;
    if (!this.isValidIban(this.model.iban)) {
      this.errorMessage = this.$translate.instant(
        'telephony_billingAccount_svaWallet_kyc_identity_iban_format_error',
      );
      this.isLoading = false;
      return Promise.reject(this.errorMessage);
    }

    return this.saveWalletIban(this.model)
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
