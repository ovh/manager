import { ALLOWED_REGIONS, DEFAULT_REGION } from './environment.constants';

export default class EnvironmentService {
  constructor() {
    this.region = DEFAULT_REGION;
    this.version = null;
  }

  setRegion(region = DEFAULT_REGION) {
    if (!ALLOWED_REGIONS.includes(region)) {
      throw new Error(`Region ${region} is not allowed`);
    }
    this.region = region;
  }

  getRegion() {
    return this.region;
  }

  setVersion(version) {
    this.version = version;
  }

  getVersion() {
    return this.version;
  }
}
