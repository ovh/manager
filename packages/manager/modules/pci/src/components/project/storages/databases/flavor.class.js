import get from 'lodash/get';
import head from 'lodash/head';
import some from 'lodash/some';

export default class Flavor {
  constructor({ name, core, memory, storage }, availability) {
    Object.assign(this, {
      name,
      core,
      memory,
      storage,
      availability,
    });
    this.isDefault = some(availability, 'default');
  }

  isNetworkSupported(networkName) {
    return some(this.availability, { network: networkName });
  }

  get nodesCount() {
    return get(head(this.availability), 'minNodeNumber');
  }

  get nodeHourlyPrice() {
    return get(head(this.availability), 'hourlyPrice');
  }

  get nodeMonthlyPrice() {
    return get(head(this.availability), 'monthlyPrice');
  }

  get hourlyPrice() {
    return {
      priceInUcents: this.nodeHourlyPrice.priceInUcents * this.nodesCount,
      tax: this.nodeHourlyPrice.tax * this.nodesCount,
    };
  }

  get monthlyPrice() {
    return {
      priceInUcents: this.nodeMonthlyPrice.priceInUcents * this.nodesCount,
      tax: this.nodeMonthlyPrice.tax * this.nodesCount,
    };
  }

  get supportsPrivateNetwork() {
    return this.isNetworkSupported('private');
  }

  get supportsPublicNetwork() {
    return this.isNetworkSupported('public');
  }
}
