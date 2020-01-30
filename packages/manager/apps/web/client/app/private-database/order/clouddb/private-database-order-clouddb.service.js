import flatten from 'lodash/flatten';
import get from 'lodash/get';

import {
  DATACENTER_CONFIGURATION_KEY,
  ENGINE_CONFIGURATION_KEY,
  PLAN_CODE_TEMPLATE,
  PRODUCT_NAME,
} from './private-database-order-clouddb.constants';

export default class PrivateDatabaseOrderCloudDb {
  /* @ngInject */
  constructor(WucOrderCartService) {
    this.WucOrderCartService = WucOrderCartService;
  }

  getCloudDBCatalog(ovhSubsidiary) {
    return this.WucOrderCartService.getProductPublicCatalog(
      ovhSubsidiary,
      PRODUCT_NAME,
    );
  }

  getDurationsFromRamOption(cartId, ramSize) {
    const ramRegExp = new RegExp(ramSize);
    return this.WucOrderCartService.getProductOffers(cartId, PRODUCT_NAME).then(
      (offers) =>
        offers
          .find(({ planCode }) => ramRegExp.test(planCode))
          .prices.map(({ duration, interval, pricingMode }) => ({
            duration,
            interval,
            pricingMode,
          })),
    );
  }

  prepareCheckout(cartId, cartOption) {
    return this.WucOrderCartService.deleteAllItems(cartId)
      .then(() => this.addCloudDBToCart(cartId, cartOption))
      .then(({ itemId }) =>
        this.addConfiguration(
          cartId,
          itemId,
          cartOption.datacenter,
          cartOption.engine,
        ),
      )
      .then(() => this.WucOrderCartService.getCheckoutInformations(cartId));
  }

  addCloudDBToCart(cartId, cloudDBOptions) {
    const planCode = PLAN_CODE_TEMPLATE.replace('xxxx', cloudDBOptions.ramSize);

    return this.WucOrderCartService.addProductToCart(cartId, PRODUCT_NAME, {
      duration: cloudDBOptions.duration,
      planCode,
      pricingMode: cloudDBOptions.pricingMode,
      quantity: 1,
    });
  }

  addConfiguration(cartId, itemId, datacenter, version) {
    const datacenterLabel = DATACENTER_CONFIGURATION_KEY;
    const versionLabel = ENGINE_CONFIGURATION_KEY;
    return this.WucOrderCartService.addConfigurationItem(
      cartId,
      itemId,
      datacenterLabel,
      datacenter,
    ).then(() =>
      this.WucOrderCartService.addConfigurationItem(
        cartId,
        itemId,
        versionLabel,
        version,
      ),
    );
  }

  validateCheckout(cartId, checkout) {
    return this.WucOrderCartService.checkoutCart(cartId, checkout);
  }

  static filterOrderableItems(plans, filterKey) {
    return Array.from(
      new Set(
        flatten(
          flatten(plans.map(({ configurations }) => configurations))
            .filter(({ name }) => name === filterKey)
            .map(({ values }) => values),
        ),
      ),
    );
  }

  static getPricings(plans) {
    return plans.map(({ planCode, pricings }) => ({
      planCode,
      pricings,
    }));
  }

  static getOrderableDatacenters(plans) {
    return PrivateDatabaseOrderCloudDb.filterOrderableItems(
      plans,
      DATACENTER_CONFIGURATION_KEY,
    );
  }

  static getOrderableEngines(plans) {
    return PrivateDatabaseOrderCloudDb.filterOrderableItems(
      plans,
      ENGINE_CONFIGURATION_KEY,
    );
  }

  static getOrderableRamSizes(schema) {
    return get(schema.models, 'hosting.PrivateDatabase.AvailableRamSizeEnum')
      .enum;
  }
}
