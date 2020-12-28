import find from 'lodash/find';
import includes from 'lodash/includes';

export default class HostingCdnOrderService {
  /* @ngInject */
  constructor($q, WucOrderCartService) {
    this.$q = $q;
    this.WucOrderCartService = WucOrderCartService;
  }

  getCatalogAddon(ovhSubsidiary, serviceOption) {
    return this.WucOrderCartService.getProductPublicCatalog(
      ovhSubsidiary,
      'webHosting',
    ).then(({ addons }) => {
      const addonPlanCode = serviceOption.planCode;
      const addon = find(addons, { planCode: addonPlanCode });
      return !addon
        ? this.$q.reject(new Error(`No ${addonPlanCode} addon found`))
        : addon;
    });
  }

  prepareOrderCart(ovhSubsidiary) {
    const data = { cartId: null };
    return this.WucOrderCartService.createNewCart(ovhSubsidiary)
      .then(({ cartId }) => {
        data.cartId = cartId;
        this.WucOrderCartService.assignCart(cartId);
      })
      .then(() => data.cartId);
  }

  addItemToCart(cartId, serviceName, serviceOption) {
    const price = find(serviceOption.prices, ({ capacities }) =>
      includes(capacities, 'renew'),
    );
    return this.WucOrderCartService.addProductServiceOptionToCart(
      cartId,
      'webHosting',
      serviceName,
      {
        duration: price.duration,
        planCode: serviceOption.planCode,
        pricingMode: price.pricingMode,
        quantity: price.minimumQuantity,
      },
    ).then(() => this.WucOrderCartService.getCheckoutInformations(cartId));
  }

  checkoutOrderCart(autoPayWithPreferredPaymentMethod, cartId) {
    return this.WucOrderCartService.checkoutCart(cartId, {
      autoPayWithPreferredPaymentMethod,
    });
  }
}
