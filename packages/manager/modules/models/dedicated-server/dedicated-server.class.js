import { DedicatedServerHardware } from './hardware';

export class DedicatedServer {
  constructor(swsResponse = {}) {
    Object.assign(this, swsResponse);

    this.hardware = new DedicatedServerHardware();
  }
}

export default {
  DedicatedServer,
};
