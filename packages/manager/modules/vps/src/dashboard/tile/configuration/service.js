import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import startsWith from 'lodash/startsWith';
import sumBy from 'lodash/sumBy';

export default class ConfigurationTileService {
  constructor(vps, model, catalog, availableUpgrades) {
    this.vps = vps;
    this.vpsModel = model;
    this.catalog = catalog;

    this.availableUpgrades = availableUpgrades;
    this.pricingMode = get(
      head(get(head(this.availableUpgrades), 'prices')),
      'pricingMode',
    );

    this.memory = model.memory;
    this.storage = model.storage;
  }

  get currentPlan() {
    return this.catalog.plans.find(
      ({ planCode }) => planCode === this.vpsModel.name,
    );
  }

  get price() {
    const prices = this.currentPlan.pricings.filter(
      ({ mode }) => mode === this.pricingMode,
    );
    return sumBy(prices, 'price') / 100000000;
  }

  get isUpfront() {
    return startsWith(this.pricingMode, 'upfront');
  }

  getPlanPriceDiff(upperPlan, upperPlanTotalPriceValue) {
    return ConfigurationTileService.getPriceStructure(
      upperPlanTotalPriceValue - this.price,
      upperPlan.prices[0].price,
    );
  }

  static getPlanPriceTotal(upperPlan, upperPlanTotalPriceValue) {
    return ConfigurationTileService.getPriceStructure(
      upperPlanTotalPriceValue,
      upperPlan.prices[0].price,
    );
  }

  getPlanUpfrontPriceDiff(upperPlan, upperPlanTotalPriceValue) {
    const priceWhoWillDetermineInterval = find(
      upperPlan.prices,
      ({ price }) => price.value > 0,
    );

    const priceDiff = upperPlanTotalPriceValue - this.price;

    return ConfigurationTileService.getPriceStructure(
      priceDiff / priceWhoWillDetermineInterval.interval,
      upperPlan.prices[0].price,
    );
  }

  static getPlanUpFrontPriceTotal(upperPlan, upperPlanTotalPriceValue) {
    const priceWhoWillDetermineInterval = find(
      upperPlan.prices,
      ({ price }) => price.value > 0,
    );

    return ConfigurationTileService.getPriceStructure(
      upperPlanTotalPriceValue / priceWhoWillDetermineInterval.interval,
      upperPlan.prices[0].price,
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
   *  Get informations about the upgrades available from configuration tile in the dashboard.
   *  These plans will be useful for upgrade modal.
   *
   *  @return {Object}
   */
  getAvailableUpgrades() {
    if (this.availableUpgrades) {
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

      const availableUpgradePlancodes = this.availableUpgrades.map(
        (upgrade) => upgrade.planCode,
      );
      // Exclude all products which aren't listed in available upgrades
      const availableCatalogProducts = this.catalog.products.filter((product) =>
        availableUpgradePlancodes.includes(product.name),
      );

      // get next ram plan infos
      const nextRamVps = find(availableCatalogProducts, ({ blobs }) => {
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

      // Next VPS plan info
      const nextRamVpsPlan = nextRamVps
        ? find(this.availableUpgrades, {
            planCode: nextRamVps.name,
          })
        : null;

      const nextVpsTotalPrice = nextRamVpsPlan
        ? ConfigurationTileService.getPlanPriceValue(nextRamVpsPlan)
        : null;

      // get next storage plan infos
      const nextStorageVps = find(availableCatalogProducts, ({ blobs }) => {
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

      const nextStorageTotalPrice = nextStorageVpsPlan
        ? ConfigurationTileService.getPlanPriceValue(nextStorageVpsPlan)
        : null;

      // return an object with calculated plans and price diff
      return {
        memory: {
          plan: nextRamVpsPlan,
          diff: nextRamVpsPlan
            ? this.getPlanPriceDiff(nextRamVpsPlan, nextVpsTotalPrice)
            : null,
          total: nextRamVpsPlan
            ? ConfigurationTileService.getPlanPriceTotal(
                nextRamVpsPlan,
                nextVpsTotalPrice,
              )
            : null,
          upfrontDiff:
            nextRamVpsPlan && this.isUpfront
              ? this.getPlanUpfrontPriceDiff(nextRamVpsPlan, nextVpsTotalPrice)
              : null,
          upfrontTotal:
            nextRamVpsPlan && this.isUpfront
              ? ConfigurationTileService.getPlanUpFrontPriceTotal(
                  nextRamVpsPlan,
                  nextVpsTotalPrice,
                )
              : null,
        },
        storage: {
          plan: nextStorageVpsPlan,
          diff: nextStorageVpsPlan
            ? this.getPlanPriceDiff(nextStorageVpsPlan, nextStorageTotalPrice)
            : null,
          total: nextStorageVpsPlan
            ? ConfigurationTileService.getPlanPriceTotal(
                nextStorageVpsPlan,
                nextStorageTotalPrice,
              )
            : null,
          upfrontDiff:
            nextStorageVpsPlan && this.isUpfront
              ? this.getPlanUpfrontPriceDiff(
                  nextStorageVpsPlan,
                  nextStorageTotalPrice,
                )
              : null,
          upfrontTotal:
            nextStorageVpsPlan && this.isUpfront
              ? ConfigurationTileService.getPlanUpFrontPriceTotal(
                  nextStorageVpsPlan,
                  nextStorageTotalPrice,
                )
              : null,
        },
      };
    }
    return null;
  }
}
