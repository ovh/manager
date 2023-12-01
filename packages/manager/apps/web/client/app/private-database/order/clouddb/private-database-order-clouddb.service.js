import flatten from 'lodash/flatten';

import {
  DATACENTER_CONFIGURATION_KEY,
  ENGINE_CONFIGURATION_KEY,
  PLAN_CODE_TEMPLATE,
  PRODUCT_NAME,
} from './private-database-order-clouddb.constants';

export default class PrivateDatabaseOrderCloudDb {
  /* @ngInject */
  constructor(WucOrderCartService, $filter) {
    this.WucOrderCartService = WucOrderCartService;
    this.$filter = $filter;
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

  static getOrderableDatacenter(plans) {
    // there is only one available datacenter per geographical zone
    return PrivateDatabaseOrderCloudDb.filterOrderableItems(
      plans,
      DATACENTER_CONFIGURATION_KEY,
    )[0];
  }

  static getOrderableEngines(plans) {
    return PrivateDatabaseOrderCloudDb.filterOrderableItems(
      plans,
      ENGINE_CONFIGURATION_KEY,
    );
  }

  getOrderedRamSizes(plans) {
    const sizeRegex = /(\d+)\s*(GB|MB)$/;

    return plans
      .reduce((sizes, plan) => {
        const matches = plan.invoiceName.match(sizeRegex);
        if (matches) {
          const value = parseInt(matches[1], 10);
          const ram = matches[2] === 'GB' ? value * 1024 : value;
          sizes.push({
            label: this.$filter('bytes')(ram, undefined, false, 'MB'),
            value: ram,
          });
        }

        return sizes;
      }, [])
      .sort((a, b) => {
        return a.value > b.value;
      });
  }
}
