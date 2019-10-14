import snakeCase from 'lodash/snakeCase';

export default class OvhPaymentMean {
  constructor(options = {}) {
    this.id = options.id;
    this.state = options.state;
    this.meanType = options.meanType;
    this.registrable = options.registrable;
    this.description = options.description;
  }

  toPaymentMethod() {
    return {
      paymentMethodId: this.id,
      paymentType: snakeCase(this.meanType).toUpperCase(),
      description: this.description,
      status: snakeCase(this.state).toUpperCase(),
      default: this.defaultPaymentMean,
    };
  }
}
