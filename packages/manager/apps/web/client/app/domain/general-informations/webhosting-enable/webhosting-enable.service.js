import map from 'lodash/map';

export default class WebhostingEnableService {
  /* @ngInject */
  constructor($q, WucOrderCartService) {
    this.$q = $q;
    this.WucOrderCartService = WucOrderCartService;
  }

  updateOption(cart, previousItem, domainName, offer, configuration) {
    const deleteItem = previousItem
      ? this.WucOrderCartService.deleteItem(cart.cartId, previousItem.itemId)
      : this.$q.resolve();

    return deleteItem.then(() =>
      this.WucOrderCartService.addProductServiceOptionToCart(
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
              this.WucOrderCartService.addConfigurationItem(
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
