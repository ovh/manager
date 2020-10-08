import get from 'lodash/get';

import { HARDWARE_RAID_ENUM } from '../constants';

export default class DedicatedServerRaidController {
  constructor({ type, model, disks }) {
    this.type = type;
    this.model = model;
    this.disks = disks;
  }

  get displayName() {
    return `${this.model} (${this.type})`;
  }

  getAvailableRaids() {
    const numberOfDisk = get(this.disks, '[0].names').length;
    const availableRaids = [];

    if (numberOfDisk >= 8) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid60);
    }

    if (numberOfDisk >= 6) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid50);
    }

    if (numberOfDisk >= 4) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid6, HARDWARE_RAID_ENUM.raid10);
    }

    if (numberOfDisk >= 3) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid5);
    }

    if (numberOfDisk >= 2) {
      availableRaids.push(HARDWARE_RAID_ENUM.raid1, HARDWARE_RAID_ENUM.raid0);
    }

    return availableRaids.reverse();
  }
}
