import find from 'lodash/find';
import get from 'lodash/get';
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

  getGpu() {
    return get(this, 'technicalBlob.gpu');
  }

  getGpuCount() {
    return get(this.getGpu(), 'number');
  }

  getGpuModel() {
    return get(this.getGpu(), 'model');
  }

  getNvme() {
    return get(this, 'technicalBlob.nvme');
  }

  getNvmeCount() {
    return get(this.getNvme(), 'disks[0].number');
  }

  getNvmeCapacity() {
    return get(this.getNvme(), 'disks[0].capacity');
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
    let flavor = this.getFlavorByOsType(osType, isFlex);
    if (!flavor && isFlex) {
      // If source instance is flex and no equivalent flavor is found
      // then use default non-flex flavor equivalent
      flavor = this.getFlavorByOsType(osType, false);
    }
    return flavor ? flavor.getIdByRegion(region) : false;
  }

  getFlavor(flavorId) {
    return find(this.flavors, (flavor) => flavor.containsFlavor(flavorId));
  }

  hasFlexOption() {
    return some(this.flavors, (flavor) => flavor.isFlex());
  }
}
