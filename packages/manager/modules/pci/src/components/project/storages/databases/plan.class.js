import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import reduce from 'lodash/reduce';
import some from 'lodash/some';

import Region from './region.class';

export default class Plan {
  constructor({ name, description }, availabilities, flavors) {
    Object.assign(this, {
      availabilities,
      description,
      name,
    });
    this.regions = reduce(
      groupBy(this.availabilities, 'region'),
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
    this.isDefault = some(availabilities, 'default');
    this.nodesCount = this.minNodes;
  }

  get minHourlyPrice() {
    const { nodeHourlyPrice } = minBy(
      this.availabilities,
      'nodeHourlyPrice.priceInUcents',
    );
    return {
      priceInUcents: nodeHourlyPrice.priceInUcents * this.minNodes,
      tax: nodeHourlyPrice.tax * this.minNodes,
    };
  }

  get minMonthlyPrice() {
    const { nodeMonthlyPrice } = minBy(
      this.availabilities,
      'nodeMonthlyPrice.priceInUcents',
    );
    return {
      priceInUcents: nodeMonthlyPrice.priceInUcents * this.minNodes,
      tax: nodeMonthlyPrice.tax * this.minNodes,
    };
  }

  get minCores() {
    return minBy(this.availabilities, 'flavor.specifications.core').flavor.core;
  }

  get maxCores() {
    return maxBy(this.availabilities, 'flavor.specifications.core').flavor.core;
  }

  get minMemory() {
    return minBy(this.availabilities, 'flavor.memory').flavor.memory;
  }

  get maxMemory() {
    return maxBy(this.availabilities, 'flavor.memory').flavor.memory;
  }

  get minNodes() {
    return minBy(this.availabilities, 'specifications.nodes.minimum')
      .specifications.nodes.minimum;
  }

  get maxNodes() {
    return maxBy(this.availabilities, 'specifications.nodes.maximum')
      .specifications.nodes.maximum;
  }

  get minStorage() {
    return minBy(this.availabilities, 'minDiskSize').minDiskSize;
  }

  get maxStorage() {
    return maxBy(this.availabilities, 'maxDiskSize').maxDiskSize;
  }

  get specsScore() {
    return (
      this.minCores +
      this.maxCores +
      this.minMemory +
      this.maxMemory +
      this.minNodes +
      this.maxNodes +
      this.minStorage +
      this.maxStorage
    );
  }

  get id() {
    return `${this.availabilities[0].engine}-${this.name}`;
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
    return some(
      this.availabilities,
      (availability) => availability.specifications.network === networkName,
    );
  }

  get supportsPrivateNetwork() {
    return this.isNetworkSupported('private');
  }
}
