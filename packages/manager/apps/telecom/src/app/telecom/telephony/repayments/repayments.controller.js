import { REPAYMENT_AMOUNT_THRESHOLD } from './repayments.constants';

export default class TelecomTelephonyRepaymentsCtrl {
  /* @ngInject  */
  constructor(TelephonySvaWalletService, svaWallet, svaWalletLink, coreConfig) {
    this.TelephonySvaWalletService = TelephonySvaWalletService;
    this.svaWallet = svaWallet;
    this.svaWalletLink = svaWalletLink;
    this.user = coreConfig.getUser();

    this.repaymentAmountThresholdText = '';
    this.hasReachedRepaymentAmountThreshold = false;
    this.pendingAmountText = '-';
    this.availableAmountText = '-';
    this.costsAmountText = '-';
    this.iban = '';
    this.isLoadingIban = false;
  }

  $onInit() {
    const {
      svaWallet: {
        balance: { availableAmount, costsAmount, pendingAmount },
      },
      user: {
        currency: { symbol },
      },
    } = this;

    this.repaymentAmountThresholdText = `${REPAYMENT_AMOUNT_THRESHOLD} ${symbol}`;
    this.hasReachedRepaymentAmountThreshold =
      availableAmount?.value >= REPAYMENT_AMOUNT_THRESHOLD;
    this.pendingAmountText = pendingAmount?.text || '-';
    this.availableAmountText = availableAmount?.text || '-';
    this.costsAmountText = costsAmount?.text || '-';
    this.isLoadingIban = true;

    this.TelephonySvaWalletService.getBankAccount()
      .then(({ iban }) => {
        this.iban = iban;
      })
      .finally(() => {
        this.isLoadingIban = false;
      });
  }
}
