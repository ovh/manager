import get from 'lodash/get';
import head from 'lodash/head';
import some from 'lodash/some';

export default class Flavor {
  constructor({ name, core, memory }, availability) {
    Object.assign(this, {
      name,
      core,
      memory,
      availability,
    });
    this.isDefault = some(availability, 'default');
  }

  isNetworkSupported(networkName) {
    return some(this.availability, { network: networkName });
  }

  get minDiskSize() {
    return get(head(this.availability), 'minDiskSize');
  }

  get maxDiskSize() {
    return get(head(this.availability), 'maxDiskSize');
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

  compare(flavor) {
    // greater than 0 if current flavor is the lower one
    // less than 0 if current flavor is the higher one
    // 0 if equal
    if (!flavor) return -1;
    return flavor.memory - this.memory;
  }
}
