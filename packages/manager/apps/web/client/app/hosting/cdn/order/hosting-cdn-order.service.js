import find from 'lodash/find';
import includes from 'lodash/includes';

export default class HostingCdnOrderService {
  /* @ngInject */
  constructor($q, OrderCartService) {
    this.$q = $q;
    this.OrderCartService = OrderCartService;
  }

  getCatalogAddon(ovhSubsidiary, serviceOption) {
    return this.OrderCartService.getProductPublicCatalog(
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
    return this.OrderCartService.createNewCart(ovhSubsidiary)
      .then(({ cartId }) => {
        data.cartId = cartId;
        this.OrderCartService.assignCart(cartId);
      })
      .then(() => data.cartId);
  }

  addItemToCart(cartId, serviceName, serviceOption) {
    const price = find(serviceOption.prices, ({ capacities }) =>
      includes(capacities, 'renew'),
    );
    return this.OrderCartService.addProductServiceOptionToCart(
      cartId,
      'webHosting',
      serviceName,
      {
        duration: price.duration,
        planCode: serviceOption.planCode,
        pricingMode: price.pricingMode,
        quantity: price.minimumQuantity,
      },
    ).then(() => this.OrderCartService.getCheckoutInformations(cartId));
  }

  checkoutOrderCart(autoPayWithPreferredPaymentMethod, cartId) {
    return this.OrderCartService.checkoutCart(cartId, {
      autoPayWithPreferredPaymentMethod,
    });
  }
}
