import { groupBy, map, sortBy } from 'lodash-es';
import CommitmentDuration from './CommitmentDuration.class';

export default class {
  /* @ngInject */
  constructor($attrs, BillingService, coreConfig) {
    this.$attrs = $attrs;
    this.BillingService = BillingService;
    this.coreConfig = coreConfig;

    this.COMMITMENT_DURATION = {
      DEFAULT: 'default',
      P12M: 'P12M',
    };
  }

  $onInit() {
    this.fromCatalog = this.fromCatalog || this.$attrs.fromCatalog === '';
    this.prices = this.fromCatalog
      ? this.BillingService.getAvailableEngagementFromCatalog(this.pricings)
      : this.pricings;
    this.availableEngagements = groupBy(this.prices, 'configuration.duration');
    this.availableDurations = sortBy(
      map(
        this.availableEngagements,
        (commitment, duration) =>
          new CommitmentDuration(duration, commitment, this.defaultPrice),
      ),
      'monthlyDuration',
    );

    this.preselectDefaultDuration();
  }

  preselectDefaultDuration() {
    if (this.preselectDefault) {
      const { DEFAULT, P12M } = this.COMMITMENT_DURATION;
      const durations = this.availableDurations;

      this.duration =
        durations.find(
          ({ commitment }) => commitment.pricingMode === DEFAULT,
        ) || durations.find(({ duration }) => duration === P12M);
    }
  }

  onChange(duration) {
    this.onDurationChange({ duration });
  }
}
