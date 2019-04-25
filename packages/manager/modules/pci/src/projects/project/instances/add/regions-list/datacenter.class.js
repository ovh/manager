import has from 'lodash/has';

export default class Datacenter {
  constructor(region) {
    Object.assign(this, region);
  }

  hasEnoughQuota() {
    if (has(this.quota, 'instance')) {
      return this.checkInstancesNumber()
      && this.checkRamQuota()
      && this.checkCoresQuota();
    }

    return false;
  }

  checkInstancesNumber() {
    return this.quota.instance.maxInstances !== -1
    && this.quota.instance.usedInstances < this.quota.instance.maxInstances;
  }

  checkRamQuota() {
    return this.quota.instance.maxRam !== -1
    && this.quota.instance.maxRam > this.quota.instance.usedRAM;
  }

  checkCoresQuota() {
    return this.quota.instance.maxCores !== -1
    && this.quota.instance.usedCores < this.quota.instance.maxCores;
  }

  isAvailable() {
    return this.available;
  }
}
