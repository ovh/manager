import filter from 'lodash/filter';
import includes from 'lodash/includes';
import WebHostingOffer from './domain-webhosting-order-offer.class';
import {
  CONFIGURATION_OPTIONS,
  OPTION_QUANTITY,
  PRODUCT_QUANTITY,
  WEBHOSTING_ORDER_PRODUCT,
} from './domain-webhosting-order.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $http,
    OvhApiHostingWebModuleList,
    OvhApiOrder,
    WucOrderCartService,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.OvhApiHostingWebModuleList = OvhApiHostingWebModuleList;
    this.OvhApiOrder = OvhApiOrder;
    this.WucOrderCartService = WucOrderCartService;
  }

  getAvailableModules(cartId, offer) {
    return this.WucOrderCartService.getProductOptions(
      cartId,
      WEBHOSTING_ORDER_PRODUCT,
      { planCode: offer.planCode },
    );
  }

  getAvailableOffers(cartId, ovhSubsidiary) {
    return this.$q
      .all({
        catalog: this.$http
          .get(
            `/order/catalog/public/webHosting?ovhSubsidiary=${ovhSubsidiary}`,
          )
          .then(({ data: { plans } }) => plans),
        offers: this.OvhApiOrder.Cart()
          .Product()
          .v6()
          .get(
            {
              cartId,
            },
            {
              productName: WEBHOSTING_ORDER_PRODUCT,
            },
          ).$promise,
      })
      .then(({ catalog, offers }) => {
        const productPlancodes = offers.map(({ planCode }) => planCode);
        const catalogProducts = catalog.filter(({ planCode }) =>
          productPlancodes.includes(planCode),
        );

        return offers.map(({ description, planCode, prices }) => {
          const { pricings } = catalogProducts.find(
            ({ planCode: productPlanCode }) => planCode === productPlanCode,
          );

          const renewPrices = filter(prices, ({ capacities }) =>
            includes(capacities, 'renew'),
          );

          const renewPricings = filter(pricings, ({ capacities }) =>
            includes(capacities, 'renew'),
          );

          const [pricing] = renewPricings;

          const [{ duration, pricingMode }] = renewPrices;
          const durations = renewPrices.map(
            ({ duration: priceDuration }) => priceDuration,
          );

          pricing.duration = duration;
          pricing.pricingMode = pricingMode;

          return new WebHostingOffer({
            ...description,
            durations,
            planCode,
            pricing,
            pricings: renewPricings,
          });
        });
      });
  }

  prepareCheckout(cartId, cartOption, domainName) {
    const productOptions = cartOption.offer;
    const moduleOptions = cartOption.module;

    const dnsZoneValue = this.constructor.mapDnsZoneValue(
      cartOption.dnsConfiguration,
    );

    return this.addHostingToCart(
      cartId,
      domainName,
      productOptions,
      dnsZoneValue,
    )
      .then((itemId) =>
        moduleOptions
          ? this.addModuleToCart(cartId, itemId, domainName, moduleOptions)
          : null,
      )
      .then(() => this.WucOrderCartService.getCheckoutInformations(cartId));
  }

  addHostingToCart(cartId, domainName, productOptions, dnsConfiguration) {
    const { label, value } = dnsConfiguration;
    return this.WucOrderCartService.addProductToCart(
      cartId,
      WEBHOSTING_ORDER_PRODUCT,
      {
        duration: productOptions.pricing.duration,
        planCode: productOptions.planCode,
        pricingMode: productOptions.pricing.pricingMode,
        quantity: PRODUCT_QUANTITY,
      },
    ).then(({ itemId }) =>
      this.$q
        .all([
          this.WucOrderCartService.addConfigurationItem(
            cartId,
            itemId,
            CONFIGURATION_OPTIONS.LEGACY_DOMAIN,
            domainName,
          ),
          this.WucOrderCartService.addConfigurationItem(
            cartId,
            itemId,
            label,
            value,
          ),
        ])
        .then(() => itemId),
    );
  }

  addModuleToCart(cartId, itemId, domainName, moduleOptions) {
    return this.WucOrderCartService.addProductOptionToCart(
      cartId,
      WEBHOSTING_ORDER_PRODUCT,
      {
        duration: moduleOptions.duration,
        itemId,
        planCode: moduleOptions.planCode,
        pricingMode: moduleOptions.pricingMode,
        quantity: OPTION_QUANTITY,
      },
    ).then(({ itemId: productId }) =>
      this.WucOrderCartService.addConfigurationItem(
        cartId,
        productId,
        CONFIGURATION_OPTIONS.LEGACY_DOMAIN,
        domainName,
      ),
    );
  }

  validateCheckout(cartId, checkout) {
    return this.WucOrderCartService.checkoutCart(cartId, checkout);
  }

  getCatalog(ovhSubsidiary) {
    return this.$http
      .get(`/order/catalog/public/webHosting?ovhSubsidiary=${ovhSubsidiary}`)
      .then(({ data }) => data);
  }

  static mapDnsZoneValue(dnsConfiguration) {
    if (!dnsConfiguration) {
      return {
        label: CONFIGURATION_OPTIONS.DNS_ZONE.LABEL,
        value: CONFIGURATION_OPTIONS.DNS_ZONE.VALUES.NO_CHANGE,
      };
    }

    let dnsZoneValue;
    const { enableEmails, enableHosting } = dnsConfiguration;

    if (enableEmails && enableHosting) {
      dnsZoneValue = CONFIGURATION_OPTIONS.DNS_ZONE.VALUES.RESET_ALL;
    }

    if (enableEmails && !enableHosting) {
      dnsZoneValue = CONFIGURATION_OPTIONS.DNS_ZONE.VALUES.RESET_ONLY_MX;
    }

    if (!enableEmails && enableHosting) {
      dnsZoneValue = CONFIGURATION_OPTIONS.DNS_ZONE.VALUES.RESET_ONLY_A;
    }

    return {
      label: CONFIGURATION_OPTIONS.DNS_ZONE.LABEL,
      value: dnsZoneValue,
    };
  }
}
