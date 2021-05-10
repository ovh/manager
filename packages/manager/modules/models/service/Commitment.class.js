import EngagementConfiguration from './EngagementConfiguration.class';
import Pricing from './Pricing.class';

export default class Commitment {
  constructor(pricing, locale = 'fr_FR') {
    Object.assign(this, {
      pricing: new Pricing(pricing, locale),
      configuration: new EngagementConfiguration(
        pricing.engagementConfiguration,
      ),
      pricingMode: pricing.pricingMode,
    });
    this.locale = locale;

    this.price = this.pricing.price.value;
  }

  addOptionCommitment(optionEngagement) {
    this.price += optionEngagement.price;
    this.pricing = new Pricing(
      {
        ...this.pricing,
        price: {
          ...this.pricing.price,
          value: this.price,
        },
      },
      this.locale,
    );
  }

  get durationInMonths() {
    return this.configuration.getDuration();
  }

  get totalPrice() {
    return new Pricing(
      {
        duration: this.pricing.duration,
        price: {
          ...this.pricing.price,
          value: this.durationInMonths * this.pricing.monthlyPriceValue,
        },
      },
      this.locale,
    ).format();
  }

  getPriceDiff(commitment) {
    return new Pricing(
      {
        duration: this.pricing.duration,
        price: {
          ...this.pricing.price,
          value: this.totalPrice.value - commitment.totalPrice.value,
        },
      },
      this.locale,
    ).format();
  }

  get commitmentType() {
    return this.configuration.type;
  }

  isPeriodic() {
    return this.configuration.isPeriodic();
  }

  isUpfront() {
    return this.configuration.isUpfront();
  }

  getEndDate(nextBillingDate) {
    return moment(nextBillingDate)
      .add(this.durationInMonths, 'months')
      .format('LL');
  }
}
