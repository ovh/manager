import find from 'lodash/find';
import some from 'lodash/some';

import Flavor from './flavor.class';

export default class Region {
  constructor({ name }, availability, flavors) {
    Object.assign(this, {
      name,
    });
    this.flavors = flavors
      .map(
        (flavor) =>
          new Flavor(
            flavor,
            availability.filter((plan) => plan.flavor.name === flavor.name),
          ),
      )
      .sort((a, b) => b.compare(a));
    this.hasSufficientQuota = true;
    this.isDefault = some(availability, 'default');
  }

  hasEnoughQuota() {
    return this.hasSufficientQuota;
  }

  getDefaultFlavor() {
    const defaultFlavor = find(this.flavors, 'isDefault');
    return defaultFlavor || this.flavors[0];
  }

  getFlavor(flavorName) {
    return find(this.flavors, { name: flavorName });
  }
}
