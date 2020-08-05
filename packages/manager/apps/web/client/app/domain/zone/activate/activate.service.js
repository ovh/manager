import find from 'lodash/find';

export default class DomainDnsZoneActivateService {
  /* @ngInject */
  constructor(WucOrderCartService) {
    this.WucOrderCartService = WucOrderCartService;
  }

  getServiceOption(serviceName) {
    return this.WucOrderCartService.getProductServiceOptions(
      'domain',
      serviceName,
    ).then((serviceOptions) => {
      const serviceOption = find(serviceOptions, { family: 'zone' });
      if (!serviceOption) {
        throw new Error('No serviceOption found');
      } else {
        return serviceOption;
      }
    });
  }

  prepareOrderCart(ovhSubsidiary) {
    return this.WucOrderCartService.createNewCart(
      ovhSubsidiary,
    ).then((cart) => this.WucOrderCartService.assignCart(cart.cartId).then(() => cart));
  }

  addItemToCart(cartId, serviceName, serviceOption, price) {
    return this.WucOrderCartService.addProductServiceOptionToCart(
      cartId,
      'domain',
      serviceName,
      {
        duration: price.duration,
        planCode: serviceOption.planCode,
        pricingMode: price.pricingMode,
        quantity: price.minimumQuantity,
      },
    ).then((cart) => this.WucOrderCartService.addConfigurationItem(
      cartId,
      cart.itemId,
      'zone',
      serviceName,
    ).then(() => cart))
    .then((cart) => this.WucOrderCartService.addConfigurationItem(
      cartId,
      cart.itemId,
      'template',
      'minimized',
    )).then(() => this.WucOrderCartService.getCheckoutInformations(cartId));
  }

  checkoutOrderCart(autoPayWithPreferredPaymentMethod, cartId) {
    return this.WucOrderCartService.checkoutCart(cartId, {
      autoPayWithPreferredPaymentMethod,
      waiveRetractationPeriod: true,
    });
  }
}
