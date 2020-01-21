import {
  CONFIGURATION_LABEL,
  GENERIC_PRODUCT,
  PRODUCT_NAME,
} from './order.constants';

export default class MXPlan {
  /* @ngInject */
  constructor($q, WucOrderCartService) {
    this.$q = $q;
    this.WucOrderCartService = WucOrderCartService;
  }

  updateOffer(cart, item, product) {
    const deleteItemPromise = item
      ? this.WucOrderCartService.deleteItem(cart, item.itemId)
      : this.$q.resolve();

    return deleteItemPromise.then(() =>
      this.WucOrderCartService.addProductToCart(cart, PRODUCT_NAME, {
        ...GENERIC_PRODUCT,
        planCode: product.planCode,
      }),
    );
  }

  addDomainConfiguration(cart, previousItem, product, domain) {
    return this.updateOffer(cart, previousItem, product).then((item) =>
      this.$q.all({
        item,
        configuration: this.WucOrderCartService.addConfigurationItem(
          cart,
          item.itemId,
          CONFIGURATION_LABEL,
          domain,
        ),
      }),
    );
  }
}
