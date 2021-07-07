import filter from 'lodash/filter';
import get from 'lodash/get';

import { UPGRADE_TYPE } from '../dashboard.constants';

export default class TechnicalDetailsController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.formattedCPU = this.formatCPU();
    this.formattedRAM = this.formatRAM();
    this.formattedDataDisks = this.formatDisks('data');
    this.formattedCacheDisks = this.formatDisks('cache');
    this.formattedOsDisks = this.formatDisks('os');
    this.formattedExtensionCard = get(
      this.technicalDetails,
      'storage.raid',
      '-',
    );
    this.UPGRADE_TYPE = UPGRADE_TYPE;
  }

  isRamUpgradable() {
    return (
      this.upgradeWithTicketAvailable &&
      this.technicalDetails.memory?.upgradable?.length &&
      !this.upgradeTask
    );
  }

  formatRAM() {
    const ram = get(this.technicalDetails, 'memory');
    if (!ram) {
      return '-';
    }
    const freqUnit = this.$translate.instant(
      'dedicated_server_dashboard_technical_details_ram_frequency_unit',
    );
    const ramSize = ram.size ? `${ram.size} GB` : '';
    const ramType = get(ram, 'type', '');
    const ramECC = ram.ecc ? 'ECC' : '';
    const ramFrequency = ram.frequency ? `${ram.frequency} ${freqUnit}` : '';
    return `${ramSize} ${ramType} ${ramECC} ${ramFrequency}`;
  }

  formatCPU() {
    const cpu = get(this.technicalDetails, 'server.cpu');
    if (!cpu) {
      return '-';
    }
    const freqUnit = this.$translate.instant(
      'dedicated_server_dashboard_technical_details_cpu_frequency_unit',
    );
    const cpuBrand = get(cpu, 'brand', '');
    const cpuModel = get(cpu, 'model', '');
    const cpuCores = cpu.cores ? `${cpu.cores}c` : '';
    const cpuThreads = cpu.threads ? `${cpu.cores && '/'}${cpu.threads}t` : '';
    const cpuFrequency = cpu.frequency ? `${cpu.frequency} ${freqUnit}` : '';
    const cpuBoost =
      cpu.boost !== cpu.frequency ? `/${cpu.boost} ${freqUnit}` : '';
    return `${cpuBrand} ${cpuModel} - ${cpuCores}${cpuThreads} - ${cpuFrequency}${cpuBoost}`;
  }

  formatDisks(diskUsage) {
    const disks = filter(
      get(this.technicalDetails, 'storage.disks'),
      (disk) => disk.usage === diskUsage,
    );
    if (!disks.length) {
      return [];
    }
    return disks.map((disk) => {
      const number = get(disk, 'number', 1);
      const technology = get(disk, 'technology', '');
      const diskInterface = get(disk, 'interface', '');
      let capacity = Number(get(disk, 'capacity'));

      if (Number.isNaN(capacity)) {
        capacity = '-';
      } else if (capacity >= 1000) {
        capacity = `${Math.round((100 * capacity) / 1000, 2) / 100} TB`;
      } else {
        capacity = `${capacity} GB`;
      }

      return `${number}×${capacity} ${technology} ${diskInterface}`;
    });
  }

  isDisksUpgradable() {
    return (
      this.upgradeWithTicketAvailable &&
      this.technicalDetails.storage?.upgradable?.length &&
      !this.upgradeTask
    );
  }
}
