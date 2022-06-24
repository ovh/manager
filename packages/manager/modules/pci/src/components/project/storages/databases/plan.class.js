import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import reduce from 'lodash/reduce';
import some from 'lodash/some';

import Region from './region.class';

export default class Plan {
  constructor({ name, description }, availability, flavors) {
    Object.assign(this, {
      availability,
      description,
      name,
    });
    this.regions = reduce(
      groupBy(this.availability, 'region'),
      (regions, regionPlans, regionName) => [
        ...regions,
        new Region(
          { name: regionName },
          regionPlans,
          flavors.filter((flavor) =>
            find(regionPlans, ['flavor.name', flavor.name]),
          ),
        ),
      ],
      [],
    );
    this.isDefault = some(availability, 'default');
    this.nodesCount = this.minNodes;
  }

  get minHourlyPrice() {
    const { hourlyPrice } = minBy(
      this.availability,
      'hourlyPrice.priceInUcents',
    );
    return {
      priceInUcents: hourlyPrice.priceInUcents * this.minNodes,
      tax: hourlyPrice.tax * this.minNodes,
    };
  }

  get minMonthlyPrice() {
    const { monthlyPrice } = minBy(
      this.availability,
      'monthlyPrice.priceInUcents',
    );
    return {
      priceInUcents: monthlyPrice.priceInUcents * this.minNodes,
      tax: monthlyPrice.tax * this.minNodes,
    };
  }

  get minCores() {
    return minBy(this.availability, 'flavor.core').flavor.core;
  }

  get maxCores() {
    return maxBy(this.availability, 'flavor.core').flavor.core;
  }

  get minMemory() {
    return minBy(this.availability, 'flavor.memory').flavor.memory;
  }

  get maxMemory() {
    return maxBy(this.availability, 'flavor.memory').flavor.memory;
  }

  get minNodes() {
    return minBy(this.availability, 'minNodeNumber').minNodeNumber;
  }

  get maxNodes() {
    return maxBy(this.availability, 'maxNodeNumber').maxNodeNumber;
  }

  get minStorage() {
    return minBy(this.availability, 'minDiskSize').minDiskSize;
  }

  get maxStorage() {
    return maxBy(this.availability, 'maxDiskSize').maxDiskSize;
  }

  get specsScore() {
    return this.maxCores + this.maxMemory + this.maxNodes + this.maxStorage;
  }

  get id() {
    return `${this.availability[0].engine}-${this.name}`;
  }

  compare(plan) {
    // greater than 0 if current plan is the lower one
    // less than 0 if current plan is the higher one
    // 0 if equal
    if (!plan) return -1;
    const planScore = plan.specsScore;
    const thisScore = this.specsScore;
    if (planScore === thisScore) {
      return 0;
    }
    return planScore > thisScore ? 1 : -1;
  }

  getDefaultRegion() {
    const defaultRegion = find(this.regions, 'isDefault');
    return defaultRegion || this.regions[0];
  }

  getRegion(regionName) {
    return find(this.regions, { name: regionName });
  }

  isNetworkSupported(networkName) {
    return some(this.availability, { network: networkName });
  }

  get supportsPrivateNetwork() {
    return this.isNetworkSupported('private');
  }
}
