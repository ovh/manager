export default class EnvironmentService {
  constructor() {
    this.region = 'EU';
  }

  setRegion(region = 'EU') {
    this.region = region;
  }

  getRegion() {
    return this.region;
  }
}
