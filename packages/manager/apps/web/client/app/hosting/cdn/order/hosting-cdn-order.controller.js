import filter from 'lodash/filter';
import includes from 'lodash/includes';

export default class {
  /* @ngInject */
  constructor($filter, $timeout) {
    this.$filter = $filter;
    this.$timeout = $timeout;
  }

  $onInit() {
    // Auto-select duration
    this.prices = filter(this.catalogAddon.pricings, ({ capacities }) =>
      includes(capacities, 'renew'),
    );
    [this.price] = this.prices;
    this.interval = this.price.interval;
    this.isEditable = true;

    if (this.catalogAddon.pricings.length === 1) {
      // Go directly to the next step
      this.currentIndex = 1;
      this.isEditable = false;
    }
  }

  resetCart() {
    if (this.cart) {
      this.cart = undefined;
      this.cartId = undefined;
    }
  }

  async prepareCheckout() {
    if (!this.cart && !this.checkoutLoading) {
      this.checkoutLoading = true;
      const { cart, cartId } = await this.prepareOrderCart();

      this.$timeout(() => {
        this.cart = cart;
        this.cartId = cartId;
        this.checkoutLoading = false;
      });
    }
  }

  checkout() {
    this.checkoutLoading = true;

    this.checkoutOrderCart(
      // Autovalidate if the order is free
      this.isOptionFree ? this.isOptionFree : !!this.defaultPaymentMethod,
      this.cartId,
    );
  }

  getDuration(interval) {
    return this.$filter('wucDuration')(interval.toString(), 'longDate');
  }
}
