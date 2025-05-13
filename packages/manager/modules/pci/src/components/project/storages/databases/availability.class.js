import { ENGINES_PRICE_SUFFIX, ENGINES_STATUS } from './engines.constants';

const STORAGE_UNITS = {
  MB: 'MB',
  GB: 'GB',
  TB: 'TB',
};

export default class Availability {
  constructor({
    backups,
    default: defaultValue,
    engine,
    lifecycle,
    plan,
    region,
    specifications,
    version,
  }) {
    Object.assign(this, {
      backups,
      default: defaultValue,
      engine,
      lifecycle,
      plan,
      region,
      specifications,
      version,
    });

    this.defaultPrice = { priceInUcents: 0, tax: 0 };
    this.hasStorage = !!this.specifications.storage;
    this.minDiskSize = Availability.convertToGB(
      this.specifications.storage?.minimum,
    );
    this.maxDiskSize = Availability.convertToGB(
      this.specifications.storage?.maximum,
    );
    this.stepDiskSize = Availability.convertToGB(
      this.specifications.storage?.step,
    );

    this.nodesCount = this.specifications.nodes.minimum;
  }

  setPrices(prices) {
    let prefix = `databases.${this.engine.toLowerCase()}-${this.plan}-${
      this.specifications.flavor
    }`;
    if (this.lifecycle.status === ENGINES_STATUS.BETA) {
      if (prices[`${prefix}-${ENGINES_PRICE_SUFFIX.BETA}.hour.consumption`]) {
        prefix = `${prefix}-${ENGINES_PRICE_SUFFIX.BETA}`;
      }
    }
    this.nodeHourlyPrice = this.setPriceOrDefault(
      prices?.[`${prefix}.hour.consumption`],
    );
    this.nodeMonthlyPrice = this.setPriceOrDefault(
      prices?.[`${prefix}.month.consumption`],
    );
    this.hourlyPricePerGB = this.setPriceOrDefault(
      prices?.[
        `databases.${this.engine.toLowerCase()}-${
          this.plan
        }-additionnal-storage-gb.hour.consumption`
      ],
    );
    this.monthlyPricePerGB = this.setPriceOrDefault(
      prices?.[
        `databases.${this.engine.toLowerCase()}-${
          this.plan
        }-additionnal-storage-gb.month.consumption`
      ],
    );
  }

  setPriceOrDefault(priceValue) {
    return priceValue || this.defaultPrice;
  }

  setCapabilities(capabilities) {
    this.flavor = capabilities.flavors.find(
      (flavor) => flavor.name === this.specifications.flavor,
    );
    this.plan = capabilities.plans.find((plan) => plan.name === this.plan);
  }

  static convertToGB(storage) {
    if (!storage) return 0;
    const { value, unit } = storage;
    switch (unit) {
      case STORAGE_UNITS.MB:
        return value / 1000;
      case STORAGE_UNITS.GB:
        return value;
      case STORAGE_UNITS.TB:
        return value * 1000;
      default:
        return value;
    }
  }
}
