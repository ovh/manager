export default class ResiliateModalController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    BillingService,
    RESILIATION_CAPACITIES,
    RESILIATION_DEFAULT_CAPABILITY,
    coreConfig,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
    this.RESILIATION_CAPACITIES = RESILIATION_CAPACITIES;
    this.RESILIATION_DEFAULT_CAPABILITY = RESILIATION_DEFAULT_CAPABILITY;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.isUSRegion = this.coreConfig.isRegion('US');
    this.resiliateOptions = (this.capabilities || [])
      .filter((option) => this.RESILIATION_CAPACITIES.includes(option))
      .map((value) => ({
        value,
        label: this.$translate.instant(
          `billing_resiliate_${value}${
            value === 'terminateAtEngagementDate' && this.isUSRegion
              ? '_us'
              : ''
          }`,
        ),
      }));

    this.resiliateOption =
      this.resiliateOptions.length === 1
        ? this.resiliateOptions[0].value
        : this.resiliateOptions.find(
            ({ value }) => value === this.RESILIATION_DEFAULT_CAPABILITY,
          )?.value;
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
          true,
          this.$translate.instant(
            `billing_resiliate_${this.resiliateOption}${
              isResiliationImmediate ? '_immediate' : ''
            }_success`,
          ),
        );
      })
      .catch((error) => {
        const translationKeyBase = this.RESILIATION_CAPACITIES.includes(
          this.resiliateOption,
        )
          ? `billing_resiliate_${this.resiliateOption}_error`
          : 'billing_resiliate_error';
        const translationKey =
          this.resiliateOption === 'terminateAtEngagementDate' &&
          this.isUSRegion
            ? `${translationKeyBase.replace('_error', '')}_error_us`
            : translationKeyBase;
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
