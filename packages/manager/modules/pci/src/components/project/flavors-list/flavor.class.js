import { FLEX_TYPE, LEGACY_FLAVORS, SSD_DISK_TYPES } from './flavors-list.constants';

export default class Flavors {
  constructor(flavor) {
    Object.assign(this, flavor);

    this.setDiskType();
  }

  setDiskType() {
    this.diskType = SSD_DISK_TYPES.some(diskType => diskType.test(this.type)) ? 'ssd' : 'ceph';
  }

  isLegacy() {
    return LEGACY_FLAVORS.test(this.name);
  }

  isAvailable() {
    return this.available;
  }

  isFlex() {
    return FLEX_TYPE.test(this.name);
  }

  hasSsdDisk() {
    return this.diskType === 'ssd';
  }
}
