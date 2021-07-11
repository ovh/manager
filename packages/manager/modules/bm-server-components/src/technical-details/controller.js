import filter from 'lodash/filter';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';

export default class DedicatedServerTechnicalDetailsTileController {
  /* @ngInject */
  constructor($translate, ovhFeatureFlipping) {
    this.$translate = $translate;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
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
    this.gbTranslated = this.$translate.instant(
      'server_technical_details_unit_gb',
    );
    this.tbTranslated = this.$translate.instant(
      'server_technical_details_unit_tb',
    );
    this.upgradeWithTicketAvailable = false;
    this.loading = true;
    this.loadData();
  }

  isRamUpgradable() {
    return (
      this.upgradeWithTicketAvailable &&
      this.technicalDetails.memory?.upgradable?.length
    );
  }

  formatRAM() {
    const ram = get(this.technicalDetails, 'memory');
    if (!ram) {
      return '-';
    }
    const freqUnit = this.$translate.instant(
      'server_technical_details_ram_frequency_unit',
    );
    const ramSize = ram.size ? `${ram.size} ${this.gbTranslated}` : '';
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
      'server_technical_details_cpu_frequency_unit',
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
        capacity = `${Math.round((100 * capacity) / 1000, 2) / 100} ${
          this.tbTranslated
        }`;
      } else {
        capacity = `${capacity} ${this.gbTranslated}`;
      }

      return `${number}×${capacity} ${technology} ${diskInterface}`;
    });
  }

  isDisksUpgradable() {
    return (
      this.upgradeWithTicketAvailable &&
      this.technicalDetails.storage?.upgradable?.length
    );
  }

  loadData() {
    this.loading = true;
    this.ovhFeatureFlipping
      .checkFeatureAvailability('dedicated-server:upgradeWithTicket')
      .then((upgradeFeature) => {
        this.upgradeWithTicketAvailable = upgradeFeature.isFeatureAvailable(
          'dedicated-server:upgradeWithTicket',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onUpgradeRam() {
    if (isFunction(this.onRamUpgrade)) {
      this.onRamUpgrade();
    }
  }

  onUpgradeDisk() {
    if (isFunction(this.onDiskUpgrade)) {
      this.onDiskUpgrade();
    }
  }
}
