import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';

import Pricing from './model/pricing.class';

import {
  CATALOG_ITEM_TYPE_NAMES,
  ISO_DURATION_FORMAT,
  ORDER_TYPES,
} from './order.constants';

export default class OrderController {
  /* @ngInject */
  constructor($translate, WucOrderCartService) {
    this.$translate = $translate;
    this.WucOrderCartService = WucOrderCartService;

    this.currentIndex = 0;
  }

  $onInit() {
    if (!this.catalog) {
      throw new Error('WucOrderComponent requires a catalog');
    }

    this.confirmation = {};

    this.bindings = {
      catalog: this.catalog,
      catalogItemTypeName: this.catalogItemTypeName,
      productName: this.productName,
      sendCurrentState: this.sendCurrentState,
      serviceNameToAddProduct: this.serviceNameToAddProduct,
      type: this.type,
      user: this.user,

      onBeforePricingGetPlancode: this.onBeforePricingGetPlancode,
      onCheckoutSuccess: this.onCheckoutSuccess,
      onError: this.onError,
      onGetConfiguration: this.onGetConfiguration,
    };

    this.loading = {
      getCheckoutInformations: false,
      validateCheckout: false,
    };
  }

  getPricings() {
    this.pricing = null;
    this.planCode = this.bindings.onBeforePricingGetPlancode();

    if (!this.planCode) {
      throw new Error('WucOrderComponent: Invalid plan code');
    }

    const catalogPricings = get(
      this.bindings.catalog[
        CATALOG_ITEM_TYPE_NAMES[this.bindings.catalogItemTypeName]
      ].find(({ planCode }) => planCode === this.planCode),
      'pricings',
    );

    if (!catalogPricings) {
      throw new Error(
        `WucOrderComponent: No pricing found for ${this.planCode}`,
      );
    }

    this.pricings = this.computePricing(catalogPricings);

    if (this.hasUniquePricing()) {
      this.currentIndex += 1;
      [this.pricing] = this.pricings;
    }
  }

  createNewCart() {
    return this.WucOrderCartService.createNewCart(this.user.ovhSubsidiary).then(
      (cart) => {
        this.cartId = cart.cartId;
        return this.WucOrderCartService.assignCart(this.cartId);
      },
    );
  }

  computePricing(catalogPricings) {
    const pricingsOfType = OrderController.filterPricingsByCapacities(
      catalogPricings,
      this.type,
    );

    let pricings = pricingsOfType;

    if (this.type === ORDER_TYPES.RENEW) {
      const pricingWithOnlyInstallationCapacity = OrderController.getUniqueInstallationPricing(
        catalogPricings,
      );
      const pricingsWithOnlyRenewCapacity = pricingsOfType.filter(
        ({ capacities }) => isEqual(capacities, [ORDER_TYPES.RENEW]),
      );
      const pricingsWitRenewAndInstallationCapacities = pricingsOfType.filter(
        ({ capacities }) =>
          isEqual(capacities.sort(), [
            ORDER_TYPES.INSTALLATION,
            ORDER_TYPES.RENEW,
          ]),
      );

      if (
        !pricingsWitRenewAndInstallationCapacities &&
        !pricingWithOnlyInstallationCapacity &&
        pricingsWithOnlyRenewCapacity
      ) {
        throw new Error('WucOrderComponent: No installation pricing found');
      }

      pricings = pricingsWithOnlyRenewCapacity
        .map((pricing) => ({
          ...pricing,
          price:
            pricing.price +
            get(pricingWithOnlyInstallationCapacity, 'price', 0),
          tax: pricing.tax + get(pricingWithOnlyInstallationCapacity, 'tax', 0),
        }))
        .concat(pricingsWitRenewAndInstallationCapacities);
    }

    return sortBy(pricings, 'price').map((pricing) => new Pricing(pricing));
  }

  isFreePricing() {
    return this.pricing && this.pricing.isFree();
  }

  hasUniquePricing() {
    return this.pricings && this.pricings.length === 1;
  }

  getCurrentState() {
    return {
      isLoading: some(Object.values(this.loading), (value) => value),
    };
  }

  prepareCheckout() {
    this.loading.getCheckoutInformations = true;
    this.bindings.sendCurrentState({ state: this.getCurrentState() });
    const pricing = this.pricing || this.pricings[0];
    const isoDurationFormat = pricing.intervalUnit.toUpperCase();
    const iso8601Unit = ISO_DURATION_FORMAT[isoDurationFormat];

    if (!iso8601Unit) {
      throw new Error(
        `WucOrderComponent: Unknown duration ${isoDurationFormat}`,
      );
    }

    const checkoutInformations = {
      product: {
        duration: moment.duration(pricing.interval, iso8601Unit).toISOString(),
        planCode: this.planCode,
        pricingMode: pricing.mode,
        quantity: 1,
      },
      configuration: this.onGetConfiguration(),
    };

    const serviceName = this.bindings.serviceNameToAddProduct;

    return this.createNewCart()
      .then(() =>
        isString(serviceName) && !isEmpty(serviceName)
          ? this.WucOrderCartService.addProductServiceOptionToCart(
              this.cartId,
              this.bindings.productName,
              serviceName,
              checkoutInformations.product,
            )
          : this.WucOrderCartService.addProductToCart(
              this.cartId,
              this.bindings.productName,
              checkoutInformations.product,
            ),
      )
      .then(({ itemId }) =>
        Promise.all(
          checkoutInformations.configuration.map(({ label, value }) =>
            this.WucOrderCartService.addConfigurationItem(
              this.cartId,
              itemId,
              label,
              value,
            ),
          ),
        ),
      )
      .then(() => this.WucOrderCartService.getCheckoutInformations(this.cartId))
      .then(({ contracts, prices }) => {
        this.confirmation = {
          contracts,
          prices,
        };
      })
      .catch((error) =>
        !this.bindings.onError || this.bindings.onError({ error })
          ? Promise.reject(error)
          : error,
      )
      .finally(() => {
        this.loading.getCheckoutInformations = false;
        this.bindings.sendCurrentState({ state: this.getCurrentState() });
      });
  }

  validateCheckout() {
    this.loading.validateCheckout = true;
    this.bindings.sendCurrentState({ state: this.getCurrentState() });

    const checkoutParameters = {
      autoPayWithPreferredPaymentMethod: this.isFreePricing()
        ? true
        : this.autoPayWithPreferredPaymentMethod,
      waiveRetractationPeriod: false,
    };

    return this.WucOrderCartService.checkoutCart(
      this.cartId,
      checkoutParameters,
    )
      .then((checkout) => {
        this.bindings.onCheckoutSuccess({
          checkoutResult: {
            checkout,
            autoPayWithPreferredPaymentMethod: !!this.confirmation
              .autoPayWithPreferredPaymentMethod,
          },
        });
      })
      .catch((error) =>
        !this.bindings.onError || this.bindings.onError({ error })
          ? Promise.reject(error)
          : error,
      )
      .finally(() => {
        this.loading.validateCheckout = false;
        this.bindings.sendCurrentState({ state: this.getCurrentState() });
      });
  }

  static getUniqueInstallationPricing(pricings) {
    return pricings.find(
      ({ capacities }) =>
        capacities.includes(ORDER_TYPES.INSTALLATION) &&
        capacities.length === 1,
    );
  }

  static filterPricingsByCapacities(pricings, capacityType) {
    return pricings.filter(({ capacities }) =>
      capacities.includes(capacityType),
    );
  }
}
