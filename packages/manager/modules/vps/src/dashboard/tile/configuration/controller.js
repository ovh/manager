export default class VpsDashboardTileConfigurationCtrl {
  $onInit() {
    // @TODO: create a VPS model and manage that logic in it
    this.isMaxEliteVcore = this.vps.vcore === 8;
    this.isMaxEliteRam = this.isMaxEliteVcore && this.vps.ram.value === 32;
    this.isMaxEliteStorage =
      this.isMaxEliteVcore && this.stateVps.model.disk === 640;
    this.isVpsStarter = this.stateVps.model.name.indexOf('starter') >= 0;
  }
}
