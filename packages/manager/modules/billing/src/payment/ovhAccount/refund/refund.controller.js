export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  confirm() {
    this.isLoading = true;
    return this.requestRefund()
      .then(() =>
        this.goBack(
          this.$translate.instant('billing_ovhaccount_refund_success', {
            amount: this.movement.retrievableAmount?.text,
          }),
        ),
      )
      .catch((error) =>
        this.goBack(
          `${this.$translate.instant('billing_ovhaccount_refund_error')} ${
            error.data?.message
          }`,
          'danger',
        ),
      );
  }
}
