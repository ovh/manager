export default class IpFeatureAvailability {
  /* @ngInject */
  constructor(coreConfig) {
    this.target = coreConfig.getRegion();
  }

  showState() {
    return this.allow('US');
  }

  allowIPFailoverImport() {
    return this.deny('US');
  }

  allowIPFailoverOrder() {
    return this.deny('US');
  }

  allowIPFailoverAgoraOrder() {
    return this.allow('US');
  }

  allow(...args) {
    return Array.from(args).indexOf(this.target) > -1;
  }

  deny(...args) {
    return Array.from(args).indexOf(this.target) === -1;
  }
}
