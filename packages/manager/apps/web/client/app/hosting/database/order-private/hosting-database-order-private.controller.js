import get from 'lodash/get';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';

export default class HostingDatabaseOrderPrivateCtrl {
  /* @ngInject */
  constructor($filter, $timeout, $translate) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;
  }

  checkout() {
    this.checkoutLoading = true;

    this.checkoutOrderCart(this.autoPayWithPreferredPaymentMethod, this.cartId);
  }

  async initDurationStep() {
    this.durationLoading = true;

    // Reset cart if there is one
    if (this.cart) {
      await this.resetOrderCart();
      this.cart = undefined;
    }

    // Sort prices
    const prices = this.catalogProduct.pricings.filter(
      ({ interval }) => interval > 0,
    );
    this.$timeout(() => {
      this.catalogProduct.pricings = sortBy(prices, 'price');
      this.durationLoading = false;
    });
  }

  getDuration(interval) {
    return this.$filter('wucDuration')(interval.toString(), 'longDate');
  }

  getVersions(product) {
    this.catalogProduct = find(this.catalogProducts, {
      planCode: product.planCode,
    });
    const engines = find(this.catalogProduct.configurations, {
      name: 'engine',
    });

    if (!engines || !engines.values) {
      return [];
    }

    return orderBy(
      engines.values.sort().map((engine) => {
        const [engineLabel, engineVersion] = engine.split('_');
        const name = this.$translate.instant(
          `hosting_database_order_private_version_${engineLabel}`,
          { version: engineVersion },
        );

        return {
          name,
          value: engine,
          engineLabel,
          engineVersion: parseFloat(engineVersion),
        };
      }),
      ['engineLabel', 'engineVersion'],
      ['asc', 'desc'],
    );
  }

  async prepareCheckout() {
    if (!this.cart && !this.checkoutLoading) {
      this.checkoutLoading = true;
      const { cart, cartId } = await this.prepareOrderCart(
        this.order.datacenter,
        this.order.price,
        this.order.product,
        this.order.version.value,
      );

      this.$timeout(() => {
        this.cart = cart;
        this.cartId = cartId;
        this.checkoutLoading = false;
      });
    }
  }

  async updateDatacenter(serviceName) {
    this.durationLoading = true;
    const datacenter = await this.getDatacenter(serviceName);

    this.$timeout(() => {
      this.order.datacenter = datacenter;
      this.durationLoading = false;
    });
  }

  updateProductPrice(interval) {
    const prices = get(this.order, 'product.prices');
    this.order.price = find(prices, { interval });
  }

  updateVersionSelector(product) {
    this.versions = this.getVersions(product);
  }

  $onInit() {
    // For now, there is only one 'type' choice
    // So we skip the first step
    this.order = {
      datacenter: this.datacenter,
      type: 'privateSQL',
    };

    this.currentIndex = 1;
  }
}
