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
        options: this.BillingService.getOptions(this.serviceId),
      })
      .then(({ service, options }) => {
        this.service = service;
        this.service.addOptions(options);
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
          'configuration.duration',
        );
        this.availableDurations = map(
          this.availableEngagements,
          (commitment, duration) =>
            new CommitmentDuration(duration, commitment, this.defaultPrice),
        );
        this.model.duration =
          this.availableDurations.find(
            (duration) => duration.duration === this.duration,
          ) || this.availableDurations[0];
        [this.model.engagement] = this.availableEngagements[
          this.model.duration.duration
        ];
      })
      .catch((error) => {
        this.error = error.data?.message || error.message;
      });
  }

  onDurationChange(duration) {
    const commitments = this.availableEngagements[duration.duration];
    [this.model.engagement] = commitments;
  }

  getDiscount() {
    const commitments = this.availableEngagements[this.model.duration.duration];
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
    this.getDiscount();
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
