import filter from 'lodash/filter';
import get from 'lodash/get';

import { UPGRADE_TYPE } from './technical-details.constants';

export default class BmServerComponentsTechnicalDetailsController {
  /* @ngInject */
  constructor($translate, ovhFeatureFlipping, $q) {
    this.$translate = $translate;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.$q = $q;
  }

  $onInit() {
    this.$q
      .resolve(this.technicalDetails)
      .then((technicalDetails) => {
        this.technicalDetails = technicalDetails;
        this.formattedCPU = this.formatCPU();
        this.formattedRAM = this.formatRAM();
        this.formattedDataDisks = this.formatDisks('data');
        this.formattedCacheDisks = this.formatDisks('cache');
        this.formattedOsDisks = this.formatDisks('os');
        this.formattedGPU = this.formatGPU();
        this.upgradeWithTicketAvailable = false;
        this.UPGRADE_TYPE = UPGRADE_TYPE;
        if (this.goToUpgrade) {
          this.loadData();
        }
      })
      .finally(() => {
        this.loadingTechnicalDetails = false;
      });
  }

  isRamUpgradable() {
    return (
      (this.showServiceActions &&
        this.upgradeWithTicketAvailable &&
        this.technicalDetails.memory?.upgradable?.length &&
        !this.upgradeTask) ||
      (this.showServiceActions &&
        this.upgradeTask?.shouldScheduleUpgrade(this.UPGRADE_TYPE.RAM))
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
    const gbTranslated = this.$translate.instant(
      'dedicated_server_dashboard_technical_details_ram_size_unit',
    );
    const ramSize = ram.size ? `${ram.size} ${gbTranslated}` : '';
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
    const cpuNumber = get(cpu, 'number', 1);
    const cpuBrand = get(cpu, 'brand', '');
    const cpuModel = get(cpu, 'model', '');
    const cpuCores = cpu.cores ? `${cpu.cores}c` : '';
    const cpuThreads = cpu.threads ? `${cpu.cores && '/'}${cpu.threads}t` : '';
    const cpuFrequency = cpu.frequency ? `${cpu.frequency} ${freqUnit}` : '';
    const cpuBoost =
      cpu.boost !== cpu.frequency ? `/${cpu.boost} ${freqUnit}` : '';
    return `${
      cpuNumber > 1 ? `${cpuNumber}×` : ''
    } ${cpuBrand} ${cpuModel} - ${cpuCores}${cpuThreads} - ${cpuFrequency}${cpuBoost}`;
  }

  formatDisks(diskUsage) {
    const disks = filter(
      get(this.technicalDetails, 'storage.disks'),
      (disk) => disk.usage === diskUsage,
    );
    if (!disks.length) {
      return [];
    }
    const gbTranslated = this.$translate.instant(
      'dedicated_server_dashboard_technical_details_ram_size_unit',
    );
    const tbTranslated = this.$translate.instant(
      'dedicated_server_dashboard_technical_details_ram_size_unit_tb',
    );
    return disks.map((disk) => {
      const number = get(disk, 'number', 1);
      const technology = get(disk, 'technology', '');
      const diskInterface = get(disk, 'interface', '');
      const raid = get(disk, 'raid', '');
      let capacity = Number(get(disk, 'capacity'));

      if (Number.isNaN(capacity)) {
        capacity = '-';
      } else if (capacity >= 1000) {
        capacity = `${Math.round((100 * capacity) / 1000, 2) /
          100} ${tbTranslated}`;
      } else {
        capacity = `${capacity} ${gbTranslated}`;
      }

      return {
        disk:
          number === 0
            ? this.$translate.instant(
                'dedicated_server_dashboard_technical_details_disk_none',
              )
            : `${number}×${capacity} ${technology} ${diskInterface}`,
        raid: raid !== 'none' ? raid : '',
      };
    });
  }

  isDisksUpgradable() {
    return (
      (this.showServiceActions &&
        this.upgradeWithTicketAvailable &&
        this.technicalDetails.storage?.upgradable?.length &&
        !this.upgradeTask) ||
      (this.showServiceActions &&
        this.upgradeTask?.shouldScheduleUpgrade(this.UPGRADE_TYPE.STORAGE))
    );
  }

  formatGPU() {
    const { gpu } = this.technicalDetails;
    return gpu
      ? `${gpu.number}× ${gpu.brand} ${gpu.model} ${
          gpu.memory.size
        }${this.$translate.instant(
          'dedicated_server_dashboard_technical_details_ram_size_unit',
        )}`
      : null;
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
}
