import { DEDICATED_SERVER_HARDWARE_RAID_MODES } from '@ovh-ux/manager-models';

export default class DedicatedServerInstallOvhRaidModel {
  constructor() {
    this.mode = undefined;
    this.controller = undefined;
    this.diskNumber = undefined;
    this.clusterNumber = undefined;
  }

  /*= ==================================
  =            Disk number            =
  =================================== */

  getMinDisk() {
    switch (this.mode) {
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid60:
        return 8;
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid50:
        return 6;
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid10:
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid6:
        return 4;
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid5:
        return 3;
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid1:
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid0:
        return 2;
      default:
        return 1;
    }
  }

  getMinDiskPerCluster() {
    switch (this.mode) {
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid60:
        return 4;
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid50:
        return 3;
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid10:
        return 2;
      default:
        return 1;
    }
  }

  getMinCluster() {
    switch (this.mode) {
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid60:
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid50:
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid10:
        return 2;
      default:
        return 1;
    }
  }

  getMaxCluster() {
    switch (this.mode) {
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid60:
        return this.diskNumber / 4;
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid50:
        return this.diskNumber / 3;
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid10:
        return this.diskNumber / 2;
      default:
        return this.controller.numberOfDisk;
    }
  }

  isMutipleCluster() {
    switch (this.mode) {
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid60:
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid50:
      case DEDICATED_SERVER_HARDWARE_RAID_MODES.raid10:
        return true;
      default:
        return false;
    }
  }
}
