import find from 'lodash/find';

export default class HostingCdnOrderService {
  /* @ngInject */
  constructor(WucOrderCartService) {
    this.WucOrderCartService = WucOrderCartService;
  }

  async getCatalogAddon(ovhSubsidiary, serviceOption) {
    const { addons } = await this.WucOrderCartService.getProductPublicCatalog(
      ovhSubsidiary,
      'webHosting',
    );

    const addonPlanCode = serviceOption.planCode;
    const addon = find(addons, { planCode: addonPlanCode });

    if (!addon) {
      throw new Error(`No ${addonPlanCode} addon found`);
    } else {
      return addon;
    }
  }

  async getServiceOption(serviceName) {
    const serviceOptions = await this.WucOrderCartService.getProductServiceOptions(
      'webHosting',
      serviceName,
    );

    const serviceOption = find(serviceOptions, { family: 'cdn' });

    if (!serviceOption) {
      throw new Error('No serviceOption found');
    } else {
      return serviceOption;
    }
  }

  async prepareOrderCart(ovhSubsidiary) {
    const { cartId } = await this.WucOrderCartService.createNewCart(
      ovhSubsidiary,
    );

    await this.WucOrderCartService.assignCart(cartId);

    return cartId;
  }

  async addItemToCart(cartId, serviceName, serviceOption) {
    const [price] = serviceOption.prices; // Will only have one price option
    const {
      itemId,
    } = await this.WucOrderCartService.addProductServiceOptionToCart(
      cartId,
      'webHosting',
      serviceName,
      {
        duration: price.duration,
        planCode: serviceOption.planCode,
        pricingMode: price.pricingMode,
        quantity: price.minimumQuantity,
      },
    );

    await this.WucOrderCartService.addConfigurationItem(
      cartId,
      itemId,
      'legacy_domain',
      serviceName,
    );

    return this.WucOrderCartService.getCheckoutInformations(cartId);
  }

  checkoutOrderCart(autoPayWithPreferredPaymentMethod, cartId) {
    return this.WucOrderCartService.checkoutCart(cartId, {
      autoPayWithPreferredPaymentMethod,
    });
  }
}
