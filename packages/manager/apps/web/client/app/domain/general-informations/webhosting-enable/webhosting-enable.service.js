import map from 'lodash/map';

export default class WebhostingEnableService {
  /* @ngInject */
  constructor($q, OrderCartService) {
    this.$q = $q;
    this.OrderCartService = OrderCartService;
  }

  updateOption(cart, previousItem, domainName, offer, configuration) {
    const deleteItem = previousItem
      ? this.OrderCartService.deleteItem(cart.cartId, previousItem.itemId)
      : this.$q.resolve();

    return deleteItem.then(() =>
      this.OrderCartService.addProductServiceOptionToCart(
        cart.cartId,
        'domain',
        domainName,
        {
          planCode: offer.planCode,
          duration: offer.duration,
          pricingMode: offer.pricingMode,
          quantity: 1,
        },
      ).then((item) =>
        this.$q.all({
          item,
          configuration: this.$q.all(
            map(configuration, (value, label) =>
              this.OrderCartService.addConfigurationItem(
                cart.cartId,
                item.itemId,
                label,
                value,
              ),
            ),
          ),
        }),
      ),
    );
  }
}
