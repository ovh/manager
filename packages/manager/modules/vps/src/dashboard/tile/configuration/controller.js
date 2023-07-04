export default class VpsDashboardTileConfigurationCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.nichandle = coreConfig.getUser().nichandle;
  }

  $onInit() {
    // @TODO: create a VPS model and manage that logic in it
    // vCore 8 for Elite 16 for Limited Edition
    this.isMaxVcore = this.vps.vcore === 8 || this.vps.vcore === 16;
    this.isMaxRam =
      (this.vps.vcore === 8 && this.vps.ram.value === 32) ||
      this.vps.vcore === 16;
    this.isMaxStorage =
      (this.vps.vcore === 8 && this.stateVps.model.disk === 640) ||
      this.vps.vcore === 16;
    this.isVpsStarter = this.stateVps.model.name.indexOf('starter') >= 0;
  }
}
