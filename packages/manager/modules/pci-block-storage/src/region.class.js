import {
  VOLUME_MAX_SIZE,
  VOLUME_MIN_SIZE,
  VOLUME_UNLIMITED_QUOTA,
} from './block.constants';

export default class Region {
  constructor(resource) {
    this.quota = null;
    Object.assign(this, resource);
  }

  hasEnoughQuota() {
    return this.getMaxSize() >= VOLUME_MIN_SIZE;
  }

  static getMinSize() {
    return VOLUME_MIN_SIZE;
  }

  getMaxSize() {
    if (this.quota && this.quota.volume) {
      let availableGigabytes = VOLUME_MAX_SIZE;
      if (this.quota.volume.maxGigabytes !== VOLUME_UNLIMITED_QUOTA) {
        availableGigabytes = Math.min(
          VOLUME_MAX_SIZE,
          this.quota.volume.maxGigabytes - this.quota.volume.usedGigabytes,
        );
      }
      return availableGigabytes;
    }
    return VOLUME_MAX_SIZE;
  }
}
