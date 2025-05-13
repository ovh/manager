import { DedicatedServerHardware } from './hardware/hardware.class';

export class DedicatedServer {
  constructor(swsResponse = {}) {
    Object.assign(this, {
      ...swsResponse,
      hardware: new DedicatedServerHardware(),
    });
  }
}

export default {
  DedicatedServer,
};
