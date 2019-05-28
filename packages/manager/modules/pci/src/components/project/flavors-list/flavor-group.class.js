import find from 'lodash/find';
import map from 'lodash/map';
import omit from 'lodash/omit';
import union from 'lodash/union';
import uniq from 'lodash/uniq';

import { DEFAULT_OS } from './flavors-list.constants';

export default class FlavorGroup {
  constructor(flavors) {
    Object.assign(this, omit(find(flavors, { osType: DEFAULT_OS }), [
      'regions', 'id', 'osType', 'planCodes',
    ]));

    this.availableRegions = uniq(
      map(
        union(
          ...map(flavors, 'regions'),
        ),
        'region',
      ),
    );
    this.flavors = flavors;
  }

  isAvailableInRegion(region) {
    return this.availableRegions.includes(region);
  }

  getFlavorByOsType(osType) {
    return find(this.flavors, { osType });
  }

  getFlavorId(osType, region) {
    const flavor = this.getFlavorByOsType(osType);
    if (flavor) {
      return flavor.getIdByRegion(region);
    }
    return false;
  }

  getFlavor(flavorId) {
    return find(this.flavors, flavor => flavor.containsFlavor(flavorId));
  }
}
