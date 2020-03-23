import VpsConfigurationTile from './service';

export default class VpsDashboardTileConfigurationCtrl {
  constructor() {
    this.currentPlan = VpsConfigurationTile.currentPlan;
  }

  $onInit() {
    this.isMaxEliteVcore = this.vps.vcore === 8;
    this.isMaxEliteRam = this.isMaxEliteVcore && this.vps.ram.value === 32;
    this.isMaxEliteStorage = this.isMaxEliteVcore && this.stateVps.model.disk === 640;
  }
}
