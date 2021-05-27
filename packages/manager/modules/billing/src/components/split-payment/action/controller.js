export default class BillingPaymentMethodSplitPaymentActionCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  activateOrDeactivateSplitPayment() {
    this.isActioning = true;

    this.trackClick();

    return this.action()
      .then(() => {
        this.trackPage('validate');
        return this.goBack({
          text: this.$translate.instant(this.successMessageKey),
          type: 'success',
        });
      })
      .catch((error) => {
        this.trackPage('error');
        return this.goBack({
          text: `${this.$translate.instant(this.errorMessageKey)} ${error?.data
            ?.message || ''}`,
          type: 'error',
        });
      })
      .finally(() => {
        this.isActioning = false;
      });
  }
}
