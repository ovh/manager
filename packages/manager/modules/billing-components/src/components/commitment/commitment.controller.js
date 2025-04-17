import { EngagementConfiguration } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $window,
    atInternet,
    BillingService,
    BillingCommitmentService,
    coreConfig,
    ovhPaymentMethod,
    RedirectionService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
    this.BillingCommitmentService = BillingCommitmentService;
    this.coreConfig = coreConfig;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.user = this.coreConfig.getUser();

    this.translationKeySuffix =
      this.user.ovhSubsidiary === 'US' ? '_region_us' : '';
    this.billingCommitmentNoneTranslationKey = `billing_commitment_none${this.translationKeySuffix}`;
    this.billingCommitmentNoneWithDiscountTranslationKey = `billing_commitment_none_with_discount${this.translationKeySuffix}`;
    this.billingCommitmentDurationTranslationKey = `billing_commitment_duration${this.translationKeySuffix}`;
    this.billingCommitmentCommitAgainDescriptionTranslationKey = `billing_commitment_commit_again_description${this.translationKeySuffix}`;
    this.billingCommitmentCommitAgainDescriptionWithDiscountTranslationKey = `billing_commitment_commit_again_description_with_discount${this.translationKeySuffix}`;

    this.isLoadingService = true;
    this.paymentMethod = null;
    this.model = {
      duration: null,
      engagement: null,
    };
    return this.$q
      .all({
        service: this.BillingService.getService(this.serviceId),
        options: this.BillingService.getOptions(this.serviceId),
      })
      .then(({ service, options }) => {
        this.service = service;
        this.service.addOptions(options);
        this.trackPage();
        return this.BillingCommitmentService.getCatalogPrice(
          this.service,
          this.user,
        );
      })
      .then((defaultPrice) => {
        this.defaultPrice = defaultPrice;
        return this.getAvailableEngagements();
      })
      .catch((error) => {
        this.error = error;
      })
      .finally(() => {
        this.isLoadingService = false;
      });
  }

  trackPage() {
    this.atInternet.trackPage({
      name: `${
        this.pageTrackingPrefix ? this.pageTrackingPrefix : this.trackingPrefix
      }::${this.service.isEngaged() ? 'recommitment' : 'commitment'}`,
      type: 'navigation',
    });
  }

  getAvailableEngagements() {
    return this.BillingCommitmentService.getServiceAvailableEngagements(
      this.service,
    )
      .then((availableEngagements) => {
        this.availableEngagements = availableEngagements;
        this.hasDiscountAvailable = this.BillingService.hasDiscountAvailable(
          this.availableEngagements,
        );
      })
      .catch((error) => {
        this.error = error.data?.message || error.message;
      });
  }

  onDurationChange(duration) {
    this.pricingModes = this.availableEngagements.filter(
      (commitment) => commitment.durationInMonths === duration.monthlyDuration,
    );
    [this.model.engagement] = this.pricingModes;

    this.billingCommitmentSummaryDescriptionEndTranslationKey = `billing_commitment_summary_description_${this.model.engagement.commitmentType}_end${this.translationKeySuffix}`;
    this.billingCommitmentSummaryDescriptionTranslationKey = `billing_commitment_summary_description_${this.model.engagement.commitmentType}${this.translationKeySuffix}`;
  }

  getStartingDate() {
    const engagementConfiguration = new EngagementConfiguration(
      this.service?.billing?.pricing?.engagementConfiguration || {},
    );
    if (
      this.service.isEngaged() &&
      engagementConfiguration.isUpfront() &&
      this.model.engagement.isUpfront()
    ) {
      this.displayPaymentMean = false;
      this.startingDate = moment().toISOString();
      this.formattedStartingDate = moment(this.startingDate).format('LL');
      return;
    }

    this.startingDate = this.service.billing.nextBillingDate;
    this.displayPaymentMean = true;
    this.formattedStartingDate = this.service.nextBillingDate;
  }

  onPaymentStepFocus() {
    this.isPaymentStepLoading = true;
    return this.ovhPaymentMethod
      .getDefaultPaymentMethod()
      .then((paymentMethod) => {
        this.paymentMethod = paymentMethod;
      })
      .catch((error) => {
        this.error = error.data?.message || error.message;
      })
      .finally(() => {
        this.isPaymentStepLoading = false;
      });
  }

  commit() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${
        this.service.isEngaged() ? 'recommit' : 'commit'
      }::confirm_${this.model.duration.duration.toLowerCase()}_${
        this.model.engagement.commitmentType
      }`,
      type: 'action',
    });
    return this.BillingCommitmentService.commit(
      this.service,
      this.model.engagement,
    )
      .then(({ order }) => {
        if (order) {
          this.$window.open(order.url, '_blank');
        }

        return this.goBack(
          `${this.$translate.instant(
            `billing_commitment_success${this.translationKeySuffix}`,
          )}${
            order
              ? this.$translate.instant('billing_commitment_success_purchase', {
                  url: order.url,
                })
              : ''
          }`,
        );
      })
      .catch((error) => {
        this.error = error.data?.message || error.message;
      });
  }
}
