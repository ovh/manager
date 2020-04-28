import VpsConfigurationTile from '../service';

export default class VpsDashboardTileConfigurationUpgradeCtrl {
  $onInit() {
    this.isUpfront = VpsConfigurationTile.isUpfront;
  }
}
