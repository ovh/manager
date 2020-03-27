import get from 'lodash/get';
import startsWith from 'lodash/startsWith'

export default class VpsDashboardTileConfigurationUpgradeCtrl {
  $onInit() {
    const firstPlanPricingMode = get(
      this.resolve.configurationTile.upgrades,
      `${this.resolve.upgradeType}.plan.prices[0].pricingMode`,
    );

    this.isUpfront = startsWith(firstPlanPricingMode, 'upfront');
    this.isDegressivity = startsWith(firstPlanPricingMode, 'degressivity');
  }
};