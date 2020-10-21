import { DedicatedServerHardwareRaidProfile } from './raid-profile/raid-profile.class';
import { DedicatedServerHardwareSpecifications } from './specifications/specifications.class';

export class DedicatedServerHardware {
  constructor({ raidProfile, specifications } = {}) {
    this.raidProfile = null;
    this.specifications = null;

    if (raidProfile) {
      this.setRaidProfile(raidProfile);
    }

    if (specifications) {
      this.setSpecifications(specifications);
    }
  }

  setRaidProfile(raidProfile = {}) {
    if (raidProfile instanceof DedicatedServerHardwareRaidProfile) {
      this.raidProfile = raidProfile;
    } else {
      this.raidProfile = new DedicatedServerHardwareRaidProfile(raidProfile);
    }

    return this.raidProfile;
  }

  setSpecifications(specifications = {}) {
    if (specifications instanceof DedicatedServerHardwareSpecifications) {
      this.specifications = specifications;
    } else {
      this.specifications = new DedicatedServerHardwareSpecifications(
        specifications,
      );
    }

    return this.specifications;
  }
}

export default {
  DedicatedServerHardware,
};
