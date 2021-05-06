import find from 'lodash/find';
import some from 'lodash/some';

import Flavor from './flavor.class';

export default class Region {
  constructor({ name }, availability, flavors) {
    Object.assign(this, {
      name,
    });
    this.flavors = flavors.map(
      (flavor) =>
        new Flavor(
          flavor,
          availability.filter((plan) => plan.flavor.name === flavor.name),
        ),
    );
    this.hasSufficientQuota = true;
    this.isDefault = some(availability, 'default');
  }

  hasEnoughQuota() {
    return this.hasSufficientQuota;
  }

  getDefaultFlavor(selectedFlavor) {
    return this.flavors.includes(selectedFlavor)
      ? selectedFlavor
      : find(this.flavors, 'isDefault');
  }

  getFlavor(flavorName) {
    return find(this.flavors, { name: flavorName });
  }
}
