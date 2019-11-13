export default class {
  /* @ngInject */
  constructor(coreConfig) {
    this.target = coreConfig.getRegion();
  }

  allowOrderTracking() {
    return this.deny('US');
  }

  allow(...args) {
    return Array.from(args).indexOf(this.target) > -1;
  }

  deny(...args) {
    return Array.from(args).indexOf(this.target) === -1;
  }
}
