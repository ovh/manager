import some from 'lodash/some';
import { ENGINES_STATUS } from './engines.constants';

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
    return (this.availability || [])[0]?.minDiskSize;
  }

  get maxDiskSize() {
    return (this.availability || [])[0]?.maxDiskSize;
  }

  get nodesCount() {
    return (this.availability || [])[0]?.minNodeNumber;
  }

  get nodeHourlyPrice() {
    return (this.availability || [])[0]?.hourlyPrice;
  }

  get nodeMonthlyPrice() {
    return (this.availability || [])[0]?.monthlyPrice;
  }

  get hourlyPrice() {
    return {
      priceInUcents: this.nodeHourlyPrice.priceInUcents,
      tax: this.nodeHourlyPrice.tax,
    };
  }

  get monthlyPrice() {
    return {
      priceInUcents: this.nodeMonthlyPrice.priceInUcents,
      tax: this.nodeMonthlyPrice.tax,
    };
  }

  get supportsPrivateNetwork() {
    return this.isNetworkSupported('private');
  }

  get supportsPublicNetwork() {
    return this.isNetworkSupported('public');
  }

  get hasStorage() {
    return this.maxDiskSize > 0;
  }

  get isStorageRange() {
    return this.minDiskSize !== this.maxDiskSize;
  }

  get id() {
    return `${this.availability[0].engine}-${this.availability[0].plan.name}-${this.name}`;
  }

  get isDeprecated() {
    return this.availability[0].status === ENGINES_STATUS.DEPRECATED;
  }

  compare(flavor) {
    // greater than 0 if current flavor is the lower one
    // less than 0 if current flavor is the higher one
    // 0 if equal
    if (!flavor) return -1;
    return flavor.memory - this.memory;
  }
}
