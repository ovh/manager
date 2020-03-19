import VpsConfigurationTile from './service';

export default class VpsDashboardTileConfigurationCtrl {
  constructor() {
    this.currentPlan = VpsConfigurationTile.currentPlan;
  }
}
