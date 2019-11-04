import WebHostingOffer from './domain-webhosting-order-offer.class';
import {
  CONFIGURATION_OPTIONS,
  DEFAULT_PLANCODE,
  OPTION_QUANTITY,
  PRODUCT_QUANTITY,
  WEBHOSTING_ORDER_PRODUCT,
} from './domain-webhosting-order.constants';

export default class {
  /* @ngInject */
  constructor($q, OrderService, OvhApiHostingWebModuleList, OvhApiOrder) {
    this.$q = $q;
    this.OrderService = OrderService;
    this.OvhApiHostingWebModuleList = OvhApiHostingWebModuleList;
    this.OvhApiOrder = OvhApiOrder;
  }

  getAvailableModules(cartId) {
    return this.OrderService
      .getProductOptions(
        cartId,
        WEBHOSTING_ORDER_PRODUCT,
        { planCode: DEFAULT_PLANCODE },
      );
  }

  getAvailableOffers(cartId, ovhSubsidiary) {
    return this.$q.all({
      catalog: this.OvhApiOrder.Catalog().Public().v6()
        .get({ productName: WEBHOSTING_ORDER_PRODUCT, ovhSubsidiary })
        .$promise
        .then(({ plans }) => plans),
      offers: this.OvhApiOrder.Cart().Product()
        .v6()
        .get({
          cartId,
        }, {
          productName: WEBHOSTING_ORDER_PRODUCT,
        })
        .$promise,
    })
      .then(({ catalog, offers }) => {
        const productPlancodes = offers.map(({ planCode }) => planCode);
        const catalogProducts = catalog
          .filter(({ planCode }) => productPlancodes.includes(planCode));

        return offers
          .map(({ description, planCode, prices }) => {
            const { pricings } = catalogProducts
              .find(({ planCode: productPlanCode }) => planCode === productPlanCode);

            const [pricing] = pricings;
            const [{ duration, pricingMode }] = prices;
            const durations = prices.map(({ duration: priceDuration }) => priceDuration);

            pricing.duration = duration;
            pricing.pricingMode = pricingMode;

            return new WebHostingOffer({
              ...description,
              durations,
              planCode,
              pricing,
              pricings,
            });
          });
      });
  }

  prepareCheckout(cartId, cartOption, domainName) {
    const productOptions = cartOption.offer;
    const moduleOptions = cartOption.module;

    const dnsZoneValue = this.constructor
      .mapDnsZoneValue(cartOption.dnsConfiguration);

    return this.addHostingToCart(cartId, domainName, productOptions, dnsZoneValue)
      .then(itemId => (moduleOptions ? this.addModuleToCart(
        cartId,
        itemId,
        domainName,
        moduleOptions,
      ) : null))
      .then(() => this.OrderService.getCheckoutInformations(cartId));
  }

  addHostingToCart(cartId, domainName, productOptions, dnsConfiguration) {
    const { label, value } = dnsConfiguration;
    return this.OrderService
      .addProductToCart(
        cartId,
        WEBHOSTING_ORDER_PRODUCT,
        {
          duration: productOptions.pricing.duration,
          planCode: productOptions.planCode,
          pricingMode: productOptions.pricing.pricingMode,
          quantity: PRODUCT_QUANTITY,
        },
      )
      .then(({ itemId }) => this.$q.all([
        this.OrderService.addConfigurationItem(
          cartId, itemId, CONFIGURATION_OPTIONS.LEGACY_DOMAIN, domainName,
        ),
        this.OrderService.addConfigurationItem(
          cartId, itemId, label, value,
        ),
      ]).then(() => itemId));
  }

  addModuleToCart(cartId, itemId, domainName, moduleOptions) {
    return this.OrderService
      .addProductOptionToCart(cartId, WEBHOSTING_ORDER_PRODUCT, {
        duration: moduleOptions.duration,
        itemId,
        planCode: moduleOptions.planCode,
        pricingMode: moduleOptions.pricingMode,
        quantity: OPTION_QUANTITY,
      })
      .then(({ itemId: productId }) => this.OrderService.addConfigurationItem(
        cartId, productId, CONFIGURATION_OPTIONS.LEGACY_DOMAIN, domainName,
      ));
  }

  validateCheckout(cartId, checkout) {
    return this.OrderService.checkoutCart(cartId, checkout);
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
