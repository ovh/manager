import find from 'lodash/find';

export default class HostingCdnOrderService {
  /* @ngInject */
  constructor(OrderService) {
    this.OrderService = OrderService;
  }

  async getCatalogAddon(
    ovhSubsidiary,
    serviceOption,
  ) {
    try {
      const { addons } = await this.OrderService
        .getProductPublicCatalog(ovhSubsidiary, 'webHosting');

      return find(addons, { planCode: serviceOption.planCode });
    } catch (error) {
      throw error;
    }
  }

  async getServiceOption(serviceName) {
    try {
      const serviceOptions = await this.OrderService
        .getProductServiceOptions('webHosting', serviceName);

      return find(serviceOptions, { family: 'cdn' });
    } catch (error) {
      throw error;
    }
  }

  async prepareOrderCart(ovhSubsidiary) {
    try {
      const { cartId } = await this.OrderService
        .createNewCart(ovhSubsidiary);

      await this.OrderService
        .assignCart(cartId);

      return cartId;
    } catch (error) {
      throw error;
    }
  }

  async addItemToCart(
    cartId,
    serviceName,
    serviceOption,
  ) {
    try {
      const [price] = serviceOption.prices; // Will only have one price option
      const { itemId } = await this.OrderService
        .addProductServiceOptionToCart(cartId, 'webHosting', serviceName, {
          duration: price.duration,
          planCode: serviceOption.planCode,
          pricingMode: price.pricingMode,
          quantity: price.minimumQuantity,
        });

      await this.OrderService.addConfigurationItem(cartId, itemId, 'legacy_domain', serviceName);

      return this.OrderService.getCheckoutInformations(cartId);
    } catch (error) {
      throw error;
    }
  }

  checkoutOrderCart(
    autoPayWithPreferredPaymentMethod,
    cartId,
  ) {
    return this.OrderService.checkoutCart(cartId, {
      autoPayWithPreferredPaymentMethod,
    });
  }
}
