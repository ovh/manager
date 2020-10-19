export default class CatalogPricing {
  constructor({ interval, intervalUnit, commitment, price, capacities, mode }) {
    Object.assign(this, {
      interval,
      intervalUnit,
      commitment: commitment || 1,
      price,
      capacities,
      mode,
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
}
