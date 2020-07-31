import has from 'lodash/has';

export default class Datacenter {
  constructor(region) {
    Object.assign(this, region);
  }

  hasEnoughQuotaForFlavors(flavor, flavorCount = 1) {
    if (has(this.quota, 'instance')) {
      return (
        this.checkInstancesNumber(flavorCount) &&
        this.checkRamQuota(flavor, flavorCount) &&
        this.checkCoresQuota(flavor, flavorCount)
      );
    }

    return false;
  }

  checkInstancesNumber(flavorCount) {
    return (
      this.quota.instance.maxInstances !== -1 &&
      this.quota.instance.usedInstances + flavorCount  <= this.quota.instance.maxInstances
    );
  }

  checkRamQuota(flavor, flavorCount) {
    return (
      this.quota.instance.maxRam !== -1 &&
      this.quota.instance.maxRam - (this.quota.instance.usedRAM + flavor.ram * flavorCount) >= 0
    );
  }

  checkCoresQuota(flavor, flavorCount) {
    return (
      this.quota.instance.maxCores !== -1 &&
      this.quota.instance.maxCores - (this.quota.instance.usedCores + flavor.vcpus * flavorCount) >= 0
    );
  }

  isAvailable() {
    return this.available;
  }

  hasExtraBandwidthCost() {
    return ['ASIA'].includes(this.continentCode);
  }
}
