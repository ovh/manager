export class PaymentMean {
  constructor(options = {}) {
    this.id = options.id;
    this.state = options.state;
    this.meanType = options.meanType;
    this.registrable = options.registrable;
    this.description = options.description;
    this.defaultPaymentMean = options.defaultPaymentMean;
    this.icon = options.icon;
  }

  toPaymentMethod() {
    return {
      paymentMethodId: this.id,
      paymentType: this.meanType.toUpperCase(),
      description: this.description,
      status: this.state.toUpperCase(),
      default: this.defaultPaymentMean,
      icon: this.icon,
    };
  }
}

export default {
  PaymentMean,
};
