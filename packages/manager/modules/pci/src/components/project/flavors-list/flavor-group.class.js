import find from 'lodash/find';
import map from 'lodash/map';
import omit from 'lodash/omit';
import union from 'lodash/union';

import { DEFAULT_OS } from './flavors-list.constants';

export default class FlavorGroup {
  constructor(flavors) {
    Object.assign(this, omit(find(flavors, { osType: DEFAULT_OS }), [
      'region', 'id', 'osType', 'planCodes',
    ]));
    this.availableRegions = union(...map(flavors, 'regions'));
    this.flavors = flavors;
  }

  isAvailableInRegion(region) {
    return this.availableRegions.includes(region);
  }

  getFlavorByOsType(osType) {
    return find(this.flavors, { osType });
  }
}
