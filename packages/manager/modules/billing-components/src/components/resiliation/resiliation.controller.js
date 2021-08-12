export default class BillingResiliationController {
  /* @ngInject */
  constructor($translate, BillingService) {
    this.$translate = $translate;
    this.BillingService = BillingService;
  }

  resiliate() {
    this.isResiliating = true;

    return this.BillingService.putEndRuleStrategy(
      this.service.id,
      this.endStrategy,
    )
      .then(() =>
        this.onSuccess(
          this.$translate.instant('billing_resiliation_success'),
          this.endStrategy,
        ),
      )
      .catch((error) =>
        this.displayErrorMessage(
          `${this.$translate.instant('billing_resiliation_error')} ${
            error?.data?.message
          }`,
        ),
      )
      .finally(() => {
        this.isResiliating = false;
      });
  }
}
