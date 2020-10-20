import Pricing from './Pricing.class';

export default class Commitment {
  constructor(pricing) {
    Object.assign(this, {
      pricing: new Pricing(pricing),
      configuration: pricing.engagementConfiguration,
      pricingMode: pricing.pricingMode,
    });

    this.price = this.pricing.price.value;
  }

  addOptionCommitment(optionEngagement) {
    this.price += optionEngagement.price;
    this.pricing = new Pricing({
      ...this.pricing,
      price: {
        ...this.pricing.price,
        value: this.price,
      },
    });
  }

  get durationInMonths() {
    return (
      moment.duration(this.pricing.duration).asMonths() *
      moment.duration(this.configuration.duration).asMonths()
    );
  }

  get totalPrice() {
    return new Pricing({
      duration: this.pricing.duration,
      price: {
        ...this.pricing.price,
        value: this.durationInMonths * this.pricing.monthlyPriceValue,
      },
    }).format();
  }

  getPriceDiff(commitment) {
    return new Pricing({
      duration: this.pricing.duration,
      price: {
        ...this.pricing.price,
        value: this.totalPrice.value - commitment.totalPrice.value,
      },
    }).format();
  }

  get commitmentType() {
    return this.configuration.type;
  }

  isPeriodic() {
    return this.commitmentType === 'periodic';
  }

  isUpfront() {
    return this.commitmentType === 'upfront';
  }

  getEndDate(service) {
    return moment(service.billing.nextBillingDate)
      .add(this.durationInMonths, 'months')
      .format('LL');
  }
}
