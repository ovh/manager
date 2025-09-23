import { EngagementConfiguration, Pricing } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $window,
    $state,
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
    this.$state = $state;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
    this.BillingCommitmentService = BillingCommitmentService;
    this.coreConfig = coreConfig;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.user = this.coreConfig.getUser();
    this.isLoadingService = true;
    this.paymentMethod = null;
    this.model = {
      duration: null,
      engagement: null,
    };
    this.isPaymentStepLoading = true;
    this.ovhPaymentMethod
      .getDefaultPaymentMethod()
      .then((paymentMethod) => {
        this.paymentMethod = paymentMethod;
      })
      .catch((error) => {
        if (error) {
          this.error = this.$translate.instant(
            'billing_commitment_payment_method_error',
          );
          setTimeout(() => {
            this.$state.go('billing.payment.method');
          }, 3000);
        }
      });

    this.$q
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
        this.isPaymentStepLoading = false;
        this.getStartingDate();
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
    this.duration = duration;
    this.pricingModes = this.availableEngagements.filter(
      (commitment) => commitment.durationInMonths === duration.monthlyDuration,
    );
    [this.model.engagement] = this.pricingModes;
    this.computeDiscount();
  }

  hasSavings() {
    const { savings } = this.duration;

    return this.defaultPrice && savings?.value > 0;
  }

  computeDiscount() {
    const upfront = this.pricingModes.find((commitment) =>
      commitment.isUpfront(),
    );
    const periodic = this.pricingModes.find((commitment) =>
      commitment.isPeriodic(),
    );

    this.periodicTotalPrice = periodic.totalPrice.value.toFixed(2);

    if (upfront && periodic) {
      // compute discount
      const { value: savedAmount } = periodic.getPriceDiff(
        upfront,
        this.selectedQuantity,
      );
      this.discount = (savedAmount / periodic.totalPrice.value) * 100;
      this.discount = this.discount.toFixed(2);

      // compute total saving
      const { savings } = this.duration;
      const totalSavings = savedAmount + (savings?.value || 0);
      this.upfrontSavings = {
        amountSaved: new Pricing(
          {
            duration: periodic.duration,
            price: {
              currencyCode: upfront.pricing.price.currencyCode,
              value: totalSavings,
            },
          },
          this.coreConfig.getUserLocale(),
        ).getPriceAsText(),
        amountToPay: upfront.totalPrice.text,
      };
    }
  }

  getStartingDate() {
    const engagementConfiguration = new EngagementConfiguration(
      this.service?.billing?.pricing?.engagementConfiguration || {},
    );
    if (
      this.service.isEngaged() &&
      engagementConfiguration?.isUpfront() &&
      this.model.engagement?.isUpfront()
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
          `${this.$translate.instant('billing_commitment_success')}${
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
