import { groupBy, map } from 'lodash-es';
import CommitmentDuration from './CommitmentDuration.class';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $window,
    atInternet,
    BillingService,
    BillingCommitmentService,
    ovhPaymentMethod,
    RedirectionService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
    this.BillingCommitmentService = BillingCommitmentService;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.isLoadingService = true;
    this.paymentMethod = null;
    this.model = {
      duration: null,
      engagement: null,
      paymentMethod: null,
    };
    return this.$q
      .all({
        service: this.BillingService.getService(this.serviceId),
        engagement: this.BillingService.getEngagement(this.serviceId),
        options: this.BillingService.getOptions(this.serviceId),
      })
      .then(({ service, engagement, options }) => {
        this.service = service;
        this.service.addOptions(options);
        this.engagement = engagement;
        return this.BillingCommitmentService.getCatalogPrice(
          this.service,
          this.me,
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

  generatePaymentMethodUrl() {
    const callbackUrl = `${window.location.href}?duration=${this.model.duration.duration}`;
    this.addPaymentMethodUrl = `${this.RedirectionService.getURL(
      'addPaymentMethod',
    )}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }

  getAvailableEngagements() {
    return this.BillingCommitmentService.getServiceAvailableEngagements(
      this.service,
    )
      .then((availableEngagements) => {
        this.availableEngagements = groupBy(
          availableEngagements,
          'durationInMonths',
        );
        this.availableDurations = map(
          this.availableEngagements,
          (commitment, duration) =>
            new CommitmentDuration(duration, commitment, this.defaultPrice),
        );
        this.model.duration = this.availableDurations.find(
          (duration) => duration.duration === this.duration,
        );
      })
      .catch((error) => {
        this.error = error.data?.message || error.message;
      });
  }

  onDurationChange(duration) {
    const commitments = this.availableEngagements[duration.duration];

    if (this.engagement) {
      [this.model.engagement] = commitments;
    }

    const upfront = commitments.find((commitment) => commitment.isUpfront());
    const periodic = commitments.find((commitment) => commitment.isPeriodic());

    if (upfront && periodic) {
      this.discount = Math.floor(
        (periodic.totalPrice.value / upfront.totalPrice.value - 1) * 100,
      );
      this.savings = periodic.getPriceDiff(upfront);
    }
  }

  onPaymentStepFocus() {
    this.isPaymentStepLoading = true;
    return this.ovhPaymentMethod
      .getDefaultPaymentMethod()
      .then((paymentMethod) => {
        this.generatePaymentMethodUrl();
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
      name: `${this.trackingPrefix}::commit::confirm_${this.model.duration.duration}m_${this.model.engagement.commitmentType}`,
      type: 'action',
    });
    return this.BillingCommitmentService.commit(
      this.service,
      this.model.engagement,
      this.model.paymentMethod,
    )
      .then((order) => {
        if (order.order.url) {
          this.$window.open(order.order.url, '_blank');
        }

        return this.goBack(
          `${this.$translate.instant('billing_commitment_success')}${
            order.order.url
              ? this.$translate.instant('billing_commitment_success_purchase', {
                  url: order.order.url,
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
