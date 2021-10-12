import Pricing from '../service/Pricing.class';

export default class CatalogPricing {
  constructor({
    interval,
    intervalUnit,
    commitment,
    price,
    capacities,
    mode,
    engagementConfiguration,
  }) {
    Object.assign(this, {
      interval,
      intervalUnit,
      commitment: commitment || 1,
      price,
      capacities,
      mode,
      engagementConfiguration,
    });

    this.duration =
      moment.duration(interval, intervalUnit).asMonths() *
      moment.duration(this.commitment, intervalUnit).asMonths();
  }

  includesRenew() {
    return this.capacities.includes('renew');
  }

  get monthlyPrice() {
    return this.price / (100000000 * this.duration);
  }

  toPricing(user, locale) {
    const value = this.price / 100000000;

    return new Pricing(
      {
        duration: this.duration,
        price: {
          value,
          currencyCode: user.currency.code,
        },
        pricingMode: this.mode,
        interval: this.interval,
      },
      locale,
    );
  }
}
