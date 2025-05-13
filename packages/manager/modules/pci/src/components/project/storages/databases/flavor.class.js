import some from 'lodash/some';
import { ENGINES_STATUS } from './engines.constants';

export default class Flavor {
  constructor({ name, core, memory }, availabilities) {
    Object.assign(this, {
      name,
      core,
      memory,
      availabilities,
    });
    this.isDefault = some(availabilities, 'default');

    this.gbHourlyPrice = (this.availabilities || [])[0]?.hourlyPricePerGB;
    this.gbMonthlyPrice = (this.availabilities || [])[0]?.monthlyPricePerGB;

    this.hourlyPricePerGB = {
      priceInUcents: this.gbHourlyPrice.priceInUcents,
      tax: this.gbHourlyPrice.tax,
    };

    this.monthlyPricePerGB = {
      priceInUcents: this.gbMonthlyPrice.priceInUcents,
      tax: this.gbMonthlyPrice.tax,
    };
  }

  isNetworkSupported(networkName) {
    return some(
      this.availabilities,
      (availability) => availability.specifications.network === networkName,
    );
  }

  get minDiskSize() {
    return (this.availabilities || [])[0]?.minDiskSize;
  }

  get maxDiskSize() {
    return (this.availabilities || [])[0]?.maxDiskSize;
  }

  get stepDiskSize() {
    return (this.availabilities || [])[0]?.stepDiskSize;
  }

  get nodesCount() {
    return (this.availabilities || [])[0]?.specifications.nodes.minimum;
  }

  get nodeHourlyPrice() {
    return (this.availabilities || [])[0]?.nodeHourlyPrice;
  }

  get nodeMonthlyPrice() {
    return (this.availabilities || [])[0]?.nodeMonthlyPrice;
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
    return `${this.availabilities[0].engine}-${this.availabilities[0].plan.name}-${this.name}`;
  }

  get isDeprecated() {
    return (
      this.availabilities[0].lifecycle.status === ENGINES_STATUS.DEPRECATED
    );
  }

  compare(flavor) {
    // greater than 0 if current flavor is the lower one
    // less than 0 if current flavor is the higher one
    // 0 if equal
    if (!flavor) return -1;
    return flavor.memory - this.memory;
  }
}
