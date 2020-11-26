import { DedicatedServerHardwareSpecifications } from './specifications/specifications.class';

export class DedicatedServerHardware {
  constructor({ specifications } = {}) {
    this.specifications = null;

    if (specifications) {
      this.setSpecifications(specifications);
    }
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
