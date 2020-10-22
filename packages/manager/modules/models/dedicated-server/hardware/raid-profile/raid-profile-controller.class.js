import get from 'lodash/get';

import { DEDICATED_SERVER_HARDWARE_RAID_MODES } from './constants';

export class DedicatedServerHardwareRaidProfileController {
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
      availableRaids.push(DEDICATED_SERVER_HARDWARE_RAID_MODES.raid60);
    }

    if (this.numberOfDisk >= 6) {
      availableRaids.push(DEDICATED_SERVER_HARDWARE_RAID_MODES.raid50);
    }

    if (this.numberOfDisk >= 4) {
      availableRaids.push(
        DEDICATED_SERVER_HARDWARE_RAID_MODES.raid6,
        DEDICATED_SERVER_HARDWARE_RAID_MODES.raid10,
      );
    }

    if (this.numberOfDisk >= 3) {
      availableRaids.push(DEDICATED_SERVER_HARDWARE_RAID_MODES.raid5);
    }

    if (this.numberOfDisk >= 2) {
      availableRaids.push(
        DEDICATED_SERVER_HARDWARE_RAID_MODES.raid1,
        DEDICATED_SERVER_HARDWARE_RAID_MODES.raid0,
      );
    }

    return availableRaids.reverse();
  }

  /*= ====  End of Public methods  ====== */
}

export default {
  DedicatedServerHardwareRaidProfileController,
};
