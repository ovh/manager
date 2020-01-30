import find from 'lodash/find';
import map from 'lodash/map';
import omit from 'lodash/omit';
import union from 'lodash/union';
import uniq from 'lodash/uniq';
import some from 'lodash/some';

import { DEFAULT_OS } from './flavors-list.constants';

export default class FlavorGroup {
  constructor(flavors, image = DEFAULT_OS) {
    Object.assign(
      this,
      omit(
        find(flavors, (flavor) => flavor.osType === image && !flavor.isFlex()),
        ['regions', 'id', 'osType', 'planCodes'],
      ),
    );

    this.availableRegions = uniq(
      map(union(...map(flavors, 'regions')), 'region'),
    );
    this.flavors = flavors;

    this.osTypes = uniq(map(this.flavors, (flavor) => flavor.osType));
  }

  isAvailableInRegion(region) {
    return this.availableRegions.includes(region);
  }

  getFlavorByOsType(osType, isFlex = false) {
    return find(
      this.flavors,
      (flavor) => flavor.osType === osType && flavor.isFlex() === isFlex,
    );
  }

  getFlavorId(osType, region, isFlex = false) {
    const flavor = this.getFlavorByOsType(osType, isFlex);
    if (flavor) {
      return flavor.getIdByRegion(region);
    }
    return false;
  }

  getFlavor(flavorId) {
    return find(this.flavors, (flavor) => flavor.containsFlavor(flavorId));
  }

  hasFlexOption() {
    return some(this.flavors, (flavor) => flavor.isFlex());
  }
}
