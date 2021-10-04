export default class BillingResiliationController {
  /* @ngInject */
  constructor($translate, atInternet, BillingService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
  }

  resiliate() {
    this.atInternet.trackClick({
      name: `dedicated::account::billing::autorenew::${this.serviceType}::resiliation::confirm`,
      type: 'action',
    });
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

  onCancel() {
    this.atInternet.trackClick({
      name: `dedicated::account::billing::autorenew::${this.serviceType}::resiliation::cancel`,
      type: 'action',
    });
    this.goBack();
  }
}
