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
    const { addons } = await this.OrderService
      .getProductPublicCatalog(ovhSubsidiary, 'webHosting');

    const addon = find(addons, { planCode: serviceOption.planCode });

    if (!addon) {
      throw new Error('No addon found');
    } else {
      return addon;
    }
  }

  async getServiceOption(serviceName) {
    const serviceOptions = await this.OrderService
      .getProductServiceOptions('webHosting', serviceName);

    const serviceOption = find(serviceOptions, { family: 'cdn' });

    if (!serviceOption) {
      throw new Error('No serviceOption found');
    } else {
      return serviceOption;
    }
  }

  async prepareOrderCart(ovhSubsidiary) {
    const { cartId } = await this.OrderService
      .createNewCart(ovhSubsidiary);

    await this.OrderService
      .assignCart(cartId);

    return cartId;
  }

  async addItemToCart(
    cartId,
    serviceName,
    serviceOption,
  ) {
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
