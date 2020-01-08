import { MAX_INSTANCES } from './quota.constants';

export default class InstanceQuota {
  constructor(quota) {
    Object.assign(this, quota);
  }

  getMaxNumberOfInstances(flavor) {
    return Math.min(
      this.getMaxNumberDependingOnInstances(),
      this.getMaxNumberDependingOnRam(flavor.ram),
      this.getMaxNumberDependingOnCores(flavor.vcpus),
    );
  }

  getMaxNumberDependingOnInstances() {
    return this.maxInstances === -1
      ? MAX_INSTANCES
      : this.maxInstances - this.usedInstances;
  }

  getMaxNumberDependingOnRam(ram) {
    return this.maxRam === -1
      ? MAX_INSTANCES
      : Math.floor((this.maxRam - this.usedRAM) / ram);
  }

  getMaxNumberDependingOnCores(vcpus) {
    return this.maxRam === -1
      ? MAX_INSTANCES
      : Math.floor((this.maxCores - this.usedCores) / vcpus);
  }
}
