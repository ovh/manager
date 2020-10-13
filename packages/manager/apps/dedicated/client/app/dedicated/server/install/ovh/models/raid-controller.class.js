import get from 'lodash/get';

import { HARDWARE_RAID_ENUM } from '../constants';

export default class DedicatedServerRaidController {
  type;

  model;

  disks;

  constructor({ type, model, disks }) {
    Object.assign(this, {
      type,
      model,
      disks,
    });
  }

  get displayName() {
    return `${this.model} (${this.type})`;
  }

  get numberOfDisk() {
    return get(this.disks, '[0].names').length;
  }

  /*= =====================================
  =            Public methods            =
  ====================================== */

  getAvailableRaids() {
    const availableRaids = [];

    if (this.numberOfDisk >= 8) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid60);
    }

    if (this.numberOfDisk >= 6) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid50);
    }

    if (this.numberOfDisk >= 4) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid6, HARDWARE_RAID_ENUM.raid10);
    }

    if (this.numberOfDisk >= 3) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid5);
    }

    if (this.numberOfDisk >= 2) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid1, HARDWARE_RAID_ENUM.raid0);
    }

    return availableRaids.reverse();
  }

  /*= ====  End of Public methods  ====== */
}
