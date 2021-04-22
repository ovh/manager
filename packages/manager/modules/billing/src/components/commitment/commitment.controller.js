import { groupBy, map, sortBy } from 'lodash-es';
import { EngagementConfiguration } from '@ovh-ux/manager-models';
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

  getAvailableEngagements() {
    return this.BillingCommitmentService.getServiceAvailableEngagements(
      this.service,
    )
      .then((availableEngagements) => {
        this.availableEngagements = groupBy(
          availableEngagements,
          'configuration.duration',
        );
        this.availableDurations = sortBy(
          map(
            this.availableEngagements,
            (commitment, duration) =>
              new CommitmentDuration(duration, commitment, this.defaultPrice),
          ),
          'monthlyDuration',
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

  getStartingDate() {
    const engagementConfiguration = new EngagementConfiguration(
      this.service?.billing?.pricing?.engagementConfiguration,
    );
    if (
      this.service.isEngaged() &&
      engagementConfiguration.isUpfront() &&
      this.model.engagement.isUpfront()
    ) {
      this.startingDate = moment().toISOString();
      this.formattedStartingDate = moment(this.startingDate).format('LL');
      return;
    }

    this.startingDate = this.service.billing.nextBillingDate;
  }

  onPaymentStepFocus() {
    this.isPaymentStepLoading = true;
    this.getDiscount();
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
      name: `${
        this.trackingPrefix
      }::commit::confirm_${this.model.duration.duration.toLowerCase()}_${
        this.model.engagement.commitmentType
      }`,
      type: 'action',
    });
    return this.BillingCommitmentService.commit(
      this.service,
      this.model.engagement,
    )
      .then(() =>
        this.goBack(this.$translate.instant('billing_commitment_success')),
      )
      .catch((error) => {
        this.error = error.data?.message || error.message;
      });
  }
}
