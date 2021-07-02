import {
  TEMPLATE_OS_HARDWARE_RAID_ENUM,
} from '../ovh/constants';

import Utils from '../format-size/utils';

export default class BmServerComponentsOsInstallHardwareRaidController {
  /* @ngInject */
  constructor($http, $q, $scope, $filter, $translate, osInstallService) {
    this.$http = $http;
    this.$q = $q;
    this.$scope = $scope;
    this.$filter = $filter;
    this.$translate = $translate;
    this.osInstallService = osInstallService;
  }

  $onInit() {
    this.$scope.$watch(
      () => this.installation.diskGroup,
      () => {
        this.clearHardwareRaidSpace();
        this.recalculateAvailableRaid();
    });
  }

  onControllerSelect() {
    this.clearHardwareRaidSpace();
    this.recalculateAvailableRaid();
  };

  onRaidSelect() {
    this.clearHardwareRaidSpace();
    this.recalculateAvailableRaidDisks();
    this.initializeDisks();
  };

  onDisksSelect() {
    this.clearHardwareRaidSpace();
    this.recalculateAvailableArrays();
    this.initializeArray();
  };

  initializeDisks() {
    if (!this.installation.hardwareRaid.disks &&
      this.informations.hardwareRaid.availableDisks.length === 1) {
        this.installation.hardwareRaid.disks = this.informations.hardwareRaid.availableDisks[0];
        this.onDisksSelect();
    }
  }

  initializeArray() {
    if (!this.installation.hardwareRaid.arrays &&
      this.informations.hardwareRaid.availableArrays.length === 1) {
        this.installation.hardwareRaid.arrays = this.informations.hardwareRaid.availableArrays[0];
    }
  }

  onArraySelect() {
    this.recalculateSpace();
    if (
      this.informations.hardwareRaid.disks &&
      this.informations.hardwareRaid.arrays
    ) {
      this.informations.hardwareRaid.error = this.isInvalidHardwareRaid();
    }
  };

  isInvalidHardwareRaid() {
    return (
      this.installation.hardwareRaid.disks % this.installation.hardwareRaid.arrays !== 0
    );
  };

  clearHardwareRaidSpace() {
    this.installation.hardwareRaid.availableSpace = null;
    this.installation.hardwareRaid.totalSpace = null;
  };

  recalculateAvailableRaid() {
    if (this.installation.hardwareRaid.controller) {
      const nbOfDisk =
        this.installation.hardwareRaid.controller.disks[0].names.length;
      this.installation.hardwareRaid.raid = null;
      this.informations.hardwareRaid.availableDisks = [];
      this.informations.hardwareRaid.availableRaids = [];

      for (let i = 1; i < nbOfDisk + 1; i += 1) {
        this.informations.hardwareRaid.availableDisks.push(i);
      }
      if (nbOfDisk >= 8) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.raid60,
        );
      }
      if (nbOfDisk >= 6) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.raid50,
        );
      }
      if (nbOfDisk >= 4) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.raid6,
        );
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.raid10,
        );
      }
      if (nbOfDisk >= 3) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.raid5,
        );
      }
      if (nbOfDisk >= 2) {
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.raid1,
        );
        this.informations.hardwareRaid.availableRaids.push(
          TEMPLATE_OS_HARDWARE_RAID_ENUM.raid0,
        );
      }
    }
  };

  recalculateAvailableRaidDisks() {
    if (this.installation.hardwareRaid.controller) {
      const nbOfDisk =
        this.installation.hardwareRaid.controller.disks[0].names.length;
      let minDisks = 1;
      let minDisksPerArray = 1;
      this.informations.hardwareRaid.availableDisks = [];
      this.installation.hardwareRaid.disks = null;

      switch (this.installation.hardwareRaid.raid) {
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid60:
          minDisks = 8;
          minDisksPerArray = 4;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid50:
          minDisks = 6;
          minDisksPerArray = 3;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid10:
          minDisksPerArray = 2;
          minDisks = 4;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid6:
          minDisks = 4;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid5:
          minDisks = 3;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid1:
          minDisks = 2;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid0:
          minDisks = 2;
          break;
        default:
          minDisks = 1;
      }

      for (let i = minDisks; i < nbOfDisk + 1; i += minDisksPerArray) {
        this.informations.hardwareRaid.availableDisks.push(i);
      }
    }
  };

  recalculateAvailableArrays() {
    if (
      this.installation.hardwareRaid.disks &&
      this.installation.hardwareRaid.controller
    ) {
      let maxNumberArray =
        this.installation.hardwareRaid.controller.disks[0].names.length;
      let minNumberArray = 1;
      let isMultipleArrays = false;
      this.informations.hardwareRaid.availableArrays = [];
      this.installation.hardwareRaid.arrays = null;

      switch (this.installation.hardwareRaid.raid) {
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid60:
          maxNumberArray = this.installation.hardwareRaid.disks / 4;
          minNumberArray = 2;
          isMultipleArrays = true;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid50:
          maxNumberArray = this.installation.hardwareRaid.disks / 3;
          minNumberArray = 2;
          isMultipleArrays = true;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid10:
          maxNumberArray = this.installation.hardwareRaid.disks / 2;
          minNumberArray = 2;
          isMultipleArrays = true;
          break;
        default:
          break;
      }

      if (isMultipleArrays) {
        for (let i = minNumberArray; i <= maxNumberArray; i += 1) {
          if (this.installation.hardwareRaid.disks % i === 0) {
            this.informations.hardwareRaid.availableArrays.push(i);
          }
        }
      } else {
        this.informations.hardwareRaid.availableArrays = [1];
        this.installation.hardwareRaid.arrays = 1;
        this.recalculateSpace();
      }
    }
  };

  recalculateSpace() {
    if (
      this.installation.hardwareRaid.disks &&
      this.installation.hardwareRaid.arrays &&
      this.installation.hardwareRaid.controller
    ) {
      let diskSize =
        this.installation.hardwareRaid.controller.disks[0].capacity.value;
      const grappe = this.installation.hardwareRaid.arrays;
      const nbOfDisks = this.installation.hardwareRaid.disks;
      diskSize = Utils.toMb(diskSize, this.installation.hardwareRaid.controller.disks[0].capacity.unit);

      this.installation.hardwareRaid.totalSpace =
        this.installation.hardwareRaid.disks * diskSize;
      switch (this.installation.hardwareRaid.raid) {
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid60:
          this.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 2 * grappe) * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid50:
          this.installation.hardwareRaid.availableSpace =
            (nbOfDisks - grappe) * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid10:
          this.installation.hardwareRaid.availableSpace =
            grappe * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid6:
          this.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 2) * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid5:
          this.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 1) * diskSize;
          break;
        case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid1:
          this.installation.hardwareRaid.availableSpace = diskSize;
          break;
        default:
          this.installation.hardwareRaid.availableSpace =
            this.installation.hardwareRaid.totalSpace;
      }
    }
  };

  getDisplaySize(
    octetsSize,
    unitIndex = 0,
  ) {
    return this.$filter('formatSize')(octetsSize, unitIndex);
  };
}
