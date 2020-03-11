import VpsConfigurationTile from './service';

export default class VpsDashboardTileConfigurationCtrl {
  constructor() {
    this.currentPlan = VpsConfigurationTile.currentPlan;

    this.model = {
      ram: this.currentPlan,
      storage: this.currentPlan,
    };
  }
}
