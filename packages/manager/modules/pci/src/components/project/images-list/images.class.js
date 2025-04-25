import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import some from 'lodash/some';
import xor from 'lodash/xor';

import { ACTIVE_STATUS, APPLICATION_TAG } from './images.constants';

export default class Image {
  constructor(image) {
    Object.assign(this, image);

    if (this.isApp()) {
      this.appName = this.getAppName();
    }

    this.imagePath = null;
  }

  getAppName() {
    return this.name
      .replace(/^[a-z0-9\s]+ - /gi, '')
      .replace(' - deprecated', '');
  }

  isApp() {
    return includes(this.tags, APPLICATION_TAG);
  }

  isActive() {
    return includes(ACTIVE_STATUS, this.status);
  }

  isBackup() {
    return !!this.planCode && this.planCode.startsWith('snapshot.consumption');
  }

  getApplications() {
    return xor(this.tags, [APPLICATION_TAG]);
  }

  getFlavorTypes() {
    return this.flavorType ? this.flavorType.split(',') : [];
  }

  isAvailableInRegion(region) {
    return find(this.regions, { region }) || this.region === region;
  }

  isCompatibleWithFlavor(flavorType) {
    return (
      isEmpty(this.flavorType) ||
      some(this.getFlavorTypes(), (type) => includes(flavorType, type))
    );
  }

  isCompatibleWithOsTypes(osTypes) {
    return includes(osTypes, this.type);
  }

  getIdByRegion(region) {
    return get(find(this.regions, { region }), 'id');
  }
}
