export default class BillingPaymentMethodSplitPaymentActionCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  activateOrDeactivateSplitPayment() {
    this.isActioning = true;

    return this.action()
      .then(() =>
        this.goBack({
          text: this.$translate.instant(this.successMessageKey),
          type: 'success',
        }),
      )
      .catch((error) =>
        this.goBack({
          text: `${this.$translate.instant(this.errorMessageKey)} ${error?.data
            ?.message || ''}`,
          type: 'error',
        }),
      )
      .finally(() => {
        this.isActioning = false;
      });
  }
}
