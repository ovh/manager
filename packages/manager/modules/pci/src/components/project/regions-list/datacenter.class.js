import has from 'lodash/has';

export default class Datacenter {
  constructor(region) {
    Object.assign(this, region);
  }

  hasEnoughQuotaForFlavor(flavor) {
    if (has(this.quota, 'instance')) {
      return (
        this.checkInstancesNumber() &&
        this.checkRamQuota(flavor) &&
        this.checkCoresQuota(flavor)
      );
    }

    return false;
  }

  checkInstancesNumber() {
    return (
      this.quota.instance.maxInstances !== -1 &&
      this.quota.instance.usedInstances < this.quota.instance.maxInstances
    );
  }

  checkRamQuota(flavor) {
    return (
      this.quota.instance.maxRam !== -1 &&
      flavor.ram < this.quota.instance.maxRam - this.quota.instance.usedRAM
    );
  }

  checkCoresQuota(flavor) {
    return (
      this.quota.instance.maxCores !== -1 &&
      flavor.vcpus <
        this.quota.instance.maxCores - this.quota.instance.usedCores
    );
  }

  isAvailable() {
    return this.available;
  }

  hasExtraBandwidthCost() {
    return ['ASIA'].includes(this.continentCode);
  }
}
