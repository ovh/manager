import { HARDWARE_RAID_ENUM } from '../constants';

export default class DedicatedServerInstallOvhRaidModel {
  mode;

  controller;

  diskNumber;

  clusterNumber;

  /*= ==================================
  =            Disk number            =
  =================================== */

  getMinDisk() {
    switch (this.mode) {
      case HARDWARE_RAID_ENUM.raid60:
        return 8;
      case HARDWARE_RAID_ENUM.raid50:
        return 6;
      case HARDWARE_RAID_ENUM.raid10:
      case HARDWARE_RAID_ENUM.raid6:
        return 4;
      case HARDWARE_RAID_ENUM.raid5:
        return 3;
      case HARDWARE_RAID_ENUM.raid1:
      case HARDWARE_RAID_ENUM.raid0:
        return 2;
      default:
        return 1;
    }
  }

  getMinDiskPerArray() {
    switch (this.mode) {
      case HARDWARE_RAID_ENUM.raid60:
        return 4;
      case HARDWARE_RAID_ENUM.raid50:
        return 3;
      case HARDWARE_RAID_ENUM.raid10:
        return 2;
      default:
        return 1;
    }
  }

  /*= ====  End of Disk number  ====== */

  /*= ==============================
  =            Cluster            =
  =============================== */

  getMinClusterArray() {
    switch (this.mode) {
      case HARDWARE_RAID_ENUM.raid60:
      case HARDWARE_RAID_ENUM.raid50:
      case HARDWARE_RAID_ENUM.raid10:
        return 2;
      default:
        return 1;
    }
  }

  getMaxClusterArray() {
    switch (this.mode) {
      case HARDWARE_RAID_ENUM.raid60:
        return this.diskNumber / 4;
      case HARDWARE_RAID_ENUM.raid50:
        return this.diskNumber / 3;
      case HARDWARE_RAID_ENUM.raid10:
        return this.diskNumber / 2;
      default:
        return this.controller.numberOfDisk;
    }
  }

  isMutipleClusterArray() {
    switch (this.mode) {
      case HARDWARE_RAID_ENUM.raid60:
      case HARDWARE_RAID_ENUM.raid50:
      case HARDWARE_RAID_ENUM.raid10:
        return true;
      default:
        return false;
    }
  }

  /*= ====  End of Cluster  ====== */
}
