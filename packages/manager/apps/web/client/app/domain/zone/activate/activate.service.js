import find from 'lodash/find';

export default class DomainDnsZoneActivateService {
  /* @ngInject */
  constructor(OrderCartService) {
    this.OrderCartService = OrderCartService;
  }

  getServiceOption(serviceName) {
    return this.OrderCartService.getProductServiceOptions(
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
    return this.OrderCartService.createNewCart(ovhSubsidiary).then((cart) =>
      this.OrderCartService.assignCart(cart.cartId).then(() => cart),
    );
  }

  addItemToCart(cartId, serviceName, serviceOption, price) {
    return this.OrderCartService.addProductServiceOptionToCart(
      cartId,
      'domain',
      serviceName,
      {
        duration: price.duration,
        planCode: serviceOption.planCode,
        pricingMode: price.pricingMode,
        quantity: price.minimumQuantity,
      },
    )
      .then((cart) =>
        this.OrderCartService.addConfigurationItem(
          cartId,
          cart.itemId,
          'zone',
          serviceName,
        ).then(() => cart),
      )
      .then((cart) =>
        this.OrderCartService.addConfigurationItem(
          cartId,
          cart.itemId,
          'template',
          'minimized',
        ),
      )
      .then(() => this.OrderCartService.getCheckoutInformations(cartId));
  }

  checkoutOrderCart(autoPayWithPreferredPaymentMethod, cartId) {
    return this.OrderCartService.checkoutCart(cartId, {
      autoPayWithPreferredPaymentMethod,
      waiveRetractationPeriod: true,
    });
  }
}
