import { groupBy, map, sortBy } from 'lodash-es';
import CommitmentDuration from './CommitmentDuration.class';

export default class {
  /* @ngInject */
  constructor($attrs, BillingService, coreConfig) {
    this.$attrs = $attrs;
    this.BillingService = BillingService;
    this.coreConfig = coreConfig;
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
          new CommitmentDuration(duration, commitment, this.defaultPricing),
      ),
      'monthlyDuration',
    );
  }

  onChange(duration) {
    this.onDurationChange({ duration });
  }
}
