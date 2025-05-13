export default class {
  /* @ngInject */
  constructor(coreConfig) {
    this.target = coreConfig.getRegion();
  }

  hasContactChangement() {
    return this.deny('CA', 'US');
  }

  hasDedicatedServerBackupStorage() {
    return this.deny('US');
  }

  hasDedicatedServerManualRefund() {
    return this.allow('US');
  }

  hasSerialOverLan() {
    return this.deny('US');
  }

  allowDedicatedServerBandwidthOption() {
    return this.allow('EU', 'CA');
  }

  allowDedicatedServerOrderBandwidthOption() {
    return this.allow('EU', 'CA');
  }

  allowDedicatedServerOrderVrackBandwidthOption() {
    return this.allow('EU', 'CA');
  }

  allowDedicatedServerOrderTrafficOption() {
    return this.allow('EU', 'CA');
  }

  allowDedicatedServerUSBKeys() {
    return this.deny('US');
  }

  allow(...args) {
    return Array.from(args).indexOf(this.target) > -1;
  }

  deny(...args) {
    return Array.from(args).indexOf(this.target) === -1;
  }
}
