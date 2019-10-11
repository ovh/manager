export default class {
  /* @ngInject */
  constructor(coreConfig, Server) {
    this.coreConfig = coreConfig;
    this.Server = Server;
  }

  hasBandwidthOption() {
    return this.coreConfig.isRegion(['EU', 'CA']);
  }
}
