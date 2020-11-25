import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import startsWith from 'lodash/startsWith';

class ConfigurationTileService {
  constructor() {
    this.vps = null;
    this.vpsModel = null;

    this.availableUpgrades = null;
  }

  get currentPlan() {
    return find(this.availableUpgrades, {
      planCode: this.vpsModel.name,
    });
  }

  get isUpfront() {
    return startsWith(
      get(this.currentPlan, 'prices[0].pricingMode'),
      'upfront',
    );
  }

  static getPlanPriceDiff(upperPlan, currentPlan) {
    const upperPlanTotalPriceValue = ConfigurationTileService.getPlanPriceValue(
      upperPlan,
    );
    const currentPlanTotalPriceValue = ConfigurationTileService.getPlanPriceValue(
      currentPlan,
    );

    return ConfigurationTileService.getPriceStructure(
      upperPlanTotalPriceValue - currentPlanTotalPriceValue,
      head(currentPlan.prices).price,
    );
  }

  static getPlanUpfrontPriceDiff(upperPlan, currentPlan) {
    const upperPlanTotalPriceValue = ConfigurationTileService.getPlanPriceValue(
      upperPlan,
    );
    const currentPlanTotalPriceValue = ConfigurationTileService.getPlanPriceValue(
      currentPlan,
    );
    const priceWhoWillDetermineInterval = find(
      upperPlan.prices,
      ({ price }) => price.value > 0,
    );

    const priceDiff = upperPlanTotalPriceValue - currentPlanTotalPriceValue;

    return ConfigurationTileService.getPriceStructure(
      priceDiff / priceWhoWillDetermineInterval.interval,
      head(currentPlan.prices).price,
    );
  }

  static getPlanPriceValue(plan) {
    return plan.prices.reduce((total, { price }) => total + price.value, 0);
  }

  static getPriceStructure(value, { currencyCode, text }) {
    return {
      currencyCode,
      text: text.replace(/\d+(?:[.,]\d+)?/, value.toFixed(2)),
      value,
    };
  }

  /**
   *  Set the vps informations
   *
   *  @param {Object} vps      The informations provided by 2API
   *  @param {Object} vpsModel The model attribute provided by
   *                           GET /vps/{serviceName} (not present in 2API...)
   *
   *  @return {ConfigurationTileService}
   */
  setVps(vps, vpsModel) {
    this.vps = vps;
    this.vpsModel = vpsModel;

    return this;
  }

  /**
   *  Set available upgrades in order to get the current vps plan.
   *
   *  @param  {Array}   availableUpgrades response from the GET /order/upgrade/vps/{serviceName} API call.
   *
   *  @return {ConfigurationTileService}
   */
  setAvailableUpgrades(availableUpgrades) {
    this.availableUpgrades = availableUpgrades;

    return this;
  }

  /**
   *  Get informations about the upgrades available from configuration tile in the dashboard.
   *  These plans will be useful for upgrade modal.
   *
   *  @param  {Object}  catalog           response from the GET /order/catalog/public/virtualprivateserver.
   *
   *  @return {Object}
   */
  getAvailableUpgrades(catalog) {
    if (this.vpsModel.vcore === 8) {
      // if vps elite - no upgrade available from configuration tile
      return {
        memory: {
          plan: null,
        },
        storage: {
          plan: null,
        },
      };
    }

    // get next ram plan infos
    const nextRamVps = find(catalog.products, ({ blobs }) => {
      if (!get(blobs, 'technical')) {
        return false;
      }

      const cpu = get(blobs, 'technical.cpu.cores');
      const storage = get(blobs, 'technical.storage.disks[0].capacity');
      const ram = get(blobs, 'technical.memory.size');

      // try to find the VPS in the same range that have the double RAM
      // than the current plan
      return (
        cpu === this.vps.vcore &&
        storage === this.vpsModel.disk &&
        ram === this.vps.ram.value * 2
      );
    });

    const nextRamVpsPlan = nextRamVps
      ? find(this.availableUpgrades, {
          planCode: nextRamVps.name,
        })
      : null;

    // get next storage plan infos
    const nextStorageVps = find(catalog.products, ({ blobs }) => {
      if (!get(blobs, 'technical')) {
        return false;
      }

      const cpu = get(blobs, 'technical.cpu.cores');
      const ram = get(blobs, 'technical.memory.size');
      const storage = get(blobs, 'technical.storage.disks[0].capacity');

      // try to find the VPS in the same range that have the double storage (disk)
      // than the current plan
      return (
        cpu === this.vps.vcore &&
        ram === this.vps.ram.value &&
        storage === this.vpsModel.disk * 2
      );
    });

    const nextStorageVpsPlan = nextStorageVps
      ? find(this.availableUpgrades, {
          planCode: nextStorageVps.name,
        })
      : null;

    // return an object with calculated plans and price diff
    try {
      return {
        memory: {
          plan: nextRamVpsPlan,
          diff: nextRamVpsPlan
            ? ConfigurationTileService.getPlanPriceDiff(
                nextRamVpsPlan,
                this.currentPlan,
              )
            : null,
          upfrontDiff:
            nextRamVpsPlan && this.isUpfront
              ? ConfigurationTileService.getPlanUpfrontPriceDiff(
                  nextRamVpsPlan,
                  this.currentPlan,
                )
              : null,
        },
        storage: {
          plan: nextStorageVpsPlan,
          diff: nextStorageVpsPlan
            ? ConfigurationTileService.getPlanPriceDiff(
                nextStorageVpsPlan,
                this.currentPlan,
              )
            : null,
          upfrontDiff:
            nextStorageVpsPlan && this.isUpfront
              ? ConfigurationTileService.getPlanUpfrontPriceDiff(
                  nextStorageVpsPlan,
                  this.currentPlan,
                )
              : null,
        },
      };
    } catch (error) {
      return {};
    }
  }
}

export default new ConfigurationTileService();
