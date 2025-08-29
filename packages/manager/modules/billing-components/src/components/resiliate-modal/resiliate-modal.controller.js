export default class ResiliateModalController {
  /* @ngInject */
  constructor($translate, atInternet, BillingService, RESILIATION_CAPACITIES) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
    this.RESILIATION_CAPACITIES = RESILIATION_CAPACITIES;
  }

  $onInit() {
    this.resiliateOptions =
      this.capabilities?.reduce((options, option) => {
        if (this.RESILIATION_CAPACITIES.includes(option)) {
          options.push({
            value: option,
            label: this.$translate.instant(`billing_resiliate_${option}`),
          });
        }
        return options;
      }, []) || [];
    if (this.resiliateOptions.length === 1) {
      this.resiliateOption = this.resiliateOptions[0].value;
    }
  }

  resiliate() {
    this.isLoading = true;
    this.atInternet.trackClick({
      name: `hub::billing::autorenew::${this.service.serviceType}::resiliation::confirm`,
      type: 'action',
    });
    return this.BillingService.resiliate(this.resiliateOption, this.service)
      .then(() => {
        const isResiliationImmediate =
          this.resiliateOption === 'terminate' &&
          this.BillingService.shouldSkipConfirmation(this.service);
        return this.onSuccess(
          this.$translate.instant(
            `billing_resiliate_${this.resiliateOption}${
              isResiliationImmediate ? '_immediate' : ''
            }_success`,
          ),
        );
      })
      .catch((error) => {
        const translationKey = this.RESILIATION_CAPACITIES.includes(
          this.resiliateOption,
        )
          ? `billing_resiliate_${this.resiliateOption}_error`
          : 'billing_resiliate_error';
        const errorMessage = error?.data?.message || error?.message || error;
        return this.onError(
          `${this.$translate.instant(translationKey)} ${errorMessage}`,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.atInternet.trackClick({
      name: `hub::billing::autorenew::${this.service.serviceType}::resiliation::cancel`,
      type: 'action',
    });
    this.goBack();
  }
}
