import find from 'lodash/find';
import includes from 'lodash/includes';

export default class HostingCdnOrderService {
  /* @ngInject */
  constructor(WucOrderCartService, HostingCdnSharedService) {
    this.WucOrderCartService = WucOrderCartService;
    this.HostingCdnSharedService = HostingCdnSharedService;
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

  async prepareOrderCart(ovhSubsidiary) {
    const { cartId } = await this.WucOrderCartService.createNewCart(
      ovhSubsidiary,
    );
    await this.WucOrderCartService.assignCart(cartId);

    return cartId;
  }

  async addItemToCart(cartId, serviceName, serviceOption) {
    const price = find(serviceOption.prices, ({ capacities }) =>
      includes(capacities, 'renew'),
    );
    await this.WucOrderCartService.addProductServiceOptionToCart(
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

    return this.WucOrderCartService.getCheckoutInformations(cartId);
  }

  async simulateCartForUpgrade(serviceName, addonOption, serviceId) {
    const price = find(addonOption.prices, ({ capacities }) =>
      includes(capacities, 'upgrade'),
    );

    return this.HostingCdnSharedService.simulateUpgradeToSharedCDN(
      serviceId,
      addonOption.planCode,
      price,
    );
  }

  checkoutOrderCart(autoPayWithPreferredPaymentMethod, cartId) {
    return this.WucOrderCartService.checkoutCart(cartId, {
      autoPayWithPreferredPaymentMethod,
    });
  }

  checkoutOrderCartForUpgrade(
    autoPayWithPreferredPaymentMethod,
    serviceOption,
    serviceId,
  ) {
    return this.HostingCdnSharedService.upgradeToSharedCDN(
      autoPayWithPreferredPaymentMethod,
      serviceOption,
      serviceId,
    );
  }
}
