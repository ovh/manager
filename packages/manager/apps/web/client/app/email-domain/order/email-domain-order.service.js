import {
  CONFIGURATION_LABEL,
  GENERIC_PRODUCT,
  PRODUCT_NAME,
} from './order.constants';

export default class MXPlan {
  /* @ngInject */
  constructor($q, OrderService) {
    this.$q = $q;
    this.OrderService = OrderService;
  }

  updateOffer(cart, item, product) {
    const deleteItemPromise = item
      ? this.OrderService.deleteItem(cart, item.itemId)
      : this.$q.resolve();

    return deleteItemPromise.then(() =>
      this.OrderService.addProductToCart(cart, PRODUCT_NAME, {
        ...GENERIC_PRODUCT,
        planCode: product.planCode,
      }),
    );
  }

  addDomainConfiguration(cart, previousItem, product, domain) {
    return this.updateOffer(cart, previousItem, product).then((item) =>
      this.$q.all({
        item,
        configuration: this.OrderService.addConfigurationItem(
          cart,
          item.itemId,
          CONFIGURATION_LABEL,
          domain,
        ),
      }),
    );
  }
}
