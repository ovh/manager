import { SERVICE_TYPE } from '../utils/constants';

export default class ResiliateModalController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    coreConfig,
    BillingService,
    RESILIATION_CAPACITIES,
    RESILIATION_DEFAULT_CAPABILITY,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
    this.RESILIATION_CAPACITIES = RESILIATION_CAPACITIES;
    this.RESILIATION_DEFAULT_CAPABILITY = RESILIATION_DEFAULT_CAPABILITY;
    this.isUSRegion = coreConfig.isRegion('US');
    this.SERVICE_TYPE = SERVICE_TYPE;
  }

  $onInit() {
    const hasEngagementDate = (this.capabilities || []).includes(
      'terminateAtEngagementDate',
    );

    this.resiliateOptions = (this.capabilities || [])
      .filter((option) => this.RESILIATION_CAPACITIES.includes(option))
      .filter(
        (option) =>
          !(hasEngagementDate && option === 'terminateAtExpirationDate'),
      )
      .flatMap((value) => {
        if (value === 'terminateAtEngagementDate' && this.isUSRegion) {
          return [
            {
              value: 'terminateAtEngagementDate',
              label: this.$translate.instant(
                'billing_resiliate_terminateAtEngagementDate_us',
              ),
            },
            {
              value: 'terminateAtEngagementDate_monthly',
              label: this.$translate.instant(
                'billing_resiliate_terminateAtEngagementDate_monthly_us',
              ),
            },
          ];
        }
        return [
          {
            value,
            label: this.$translate.instant(
              `billing_resiliate_${value}${this.isUSRegion ? '_us' : ''}`,
            ),
          },
        ];
      });

    this.resiliateOption =
      this.resiliateOptions.length === 1
        ? this.resiliateOptions[0].value
        : this.resiliateOptions.find(
            ({ value }) => value === this.RESILIATION_DEFAULT_CAPABILITY,
          )?.value;

    this.updateContextMessage();
  }

  getContextMessageKey() {
    if (!this.isUSRegion || !this.resiliateOption) {
      return null;
    }
    const contextKeys = {
      terminateAtExpirationDate:
        'billing_resiliate_context_terminateAtExpirationDate_us',
      terminateAtEngagementDate:
        'billing_resiliate_context_terminateAtEngagementDate_us',
      terminateAtEngagementDate_monthly:
        'billing_resiliate_context_terminateAtEngagementDate_monthly_us',
    };
    return contextKeys[this.resiliateOption] || null;
  }

  updateContextMessage() {
    const key = this.getContextMessageKey();
    if (!key) {
      this.contextMessage = null;
      this.contextMessageType = null;
      return;
    }
    const date =
      this.service?.billing?.engagement?.endDate ||
      this.service?.billing?.expirationDate ||
      this.service?.expirationDate ||
      '';
    this.contextMessage = this.$translate.instant(key, { date });
    const warningOptions = [
      'terminateAtEngagementDate',
      'terminateAtEngagementDate_monthly',
    ];
    this.contextMessageType = warningOptions.includes(this.resiliateOption)
      ? 'warning'
      : 'info';
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
