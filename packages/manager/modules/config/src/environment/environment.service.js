export default class EnvironmentService {
  constructor() {
    this.region = 'EU';
    this.version = null;
    this.language = 'fr_FR';
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

  setLanguage(language = 'fr_FR') {
    this.language = language;
  }

  getLanguage() {
    return this.language;
  }
}
