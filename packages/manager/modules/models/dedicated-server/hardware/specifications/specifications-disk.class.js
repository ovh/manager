export class DedicatedServerHardwareSpecificationsDisk {
  constructor(options = {}) {
    Object.assign(this, options);
  }

  get displayDiskType() {
    return `${this.numberOfDisks} ${this.diskType}`;
  }
}

export default {
  DedicatedServerHardwareSpecificationsDisk,
};
