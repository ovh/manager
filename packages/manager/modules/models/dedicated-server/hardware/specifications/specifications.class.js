import { DedicatedServerHardwareSpecificationsDisk } from './specifications-disk.class';

export class DedicatedServerHardwareSpecifications {
  constructor(options = {}) {
    Object.assign(this, {
      ...options,
      diskGroups: options.diskGroups.map(
        (diskGroup) => new DedicatedServerHardwareSpecificationsDisk(diskGroup),
      ),
    });
  }
}

export default {
  DedicatedServerHardwareSpecifications,
};
