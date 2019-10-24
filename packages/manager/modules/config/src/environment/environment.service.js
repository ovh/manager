export default class EnvironmentService {
  constructor() {
    this.region = 'EU';
    this.version = null;
  }

  setRegion(region = 'EU') {
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
