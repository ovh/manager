import filter from 'lodash/filter';
import get from 'lodash/get';

import {
  pricingConstants,
} from '@ovh-ux/manager-product-offers';

export default class DomainDnsZoneActivateController {
  /* @ngInject */
  constructor(
    $filter,
    $timeout,
    $translate,
    $window,
    Alerter,
    DomainDnsZoneActivateService,
  ) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.DomainDnsZoneActivateService = DomainDnsZoneActivateService;
  }

  $onInit() {
    // Auto-select duration
    this.prices = filter(
      this.serviceOption.prices,
      (price) => price.pricingMode === pricingConstants.PRICING_MODE.DEFAULT,
    );
    [this.price] = this.prices;
    this.interval = this.price.interval;
    this.isEditable = true;
    if (this.prices.length === 1) {
      // Go directly to the next step
      this.currentIndex = 1;
      this.isEditable = false;
    }
  }

  resetCart() {
    if (this.cart) {
      this.cart = null;
      this.cartId = null;
    }
  }

  prepareCheckout() {
    if (!this.cart && !this.checkoutLoading) {
      this.checkoutLoading = true;
      this.prepareOrderCart(this.price)
        .then((cart) => {
          this.cart = cart;
          this.cartId = cart.cartId;
        })
        .catch((error) =>
          this.Alerter.error(
            this.$translate.instant('web_domain_zone_activation_error', {
              message: get(error, 'data.message', error),
            }),
            'app.domain.product.zoneactivate',
          ),
        )
        .finally(() => (this.checkoutLoading = false));
    }
  }

  checkout() {
    this.checkoutOrderCart(
      this.autoPayWithPreferredPaymentMethod,
      this.cartId,
      this.price.value === 0,
    );
  }

  checkoutOrderCart(autoPayWithPreferredPaymentMethod, cartId, isOptionFree) {
    this.checkoutLoading = true;
    this.DomainDnsZoneActivateService.checkoutOrderCart(
      autoPayWithPreferredPaymentMethod,
      cartId,
    )
      .then((order) => {
        if (isOptionFree) {
          this.goBack(
            this.$translate.instant('web_domain_zone_activation_order_success'),
          );
        } else {
          this.$window.open(order.url, '_blank', 'noopener');
          this.goBack(
            this.$translate.instant('web_domain_zone_activation_success', {
              t0: order.url,
            }),
          );
        }
      })
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant('web_domain_zone_activation_error', {
            message: get(error, 'data.message', error),
          }),
          'app.domain.product.zoneactivate',
        ),
      )
      .finally(() => {
        this.checkoutLoading = false;
      });
  }

  prepareOrderCart(price) {
    return this.DomainDnsZoneActivateService.prepareOrderCart(
      this.user.ovhSubsidiary,
    ).then((cart) =>
      this.DomainDnsZoneActivateService.addItemToCart(
        cart.cartId,
        this.serviceName,
        this.serviceOption,
        price,
      ).then((finalCart) => {
        return { ...finalCart, cartId: cart.cartId }
      }),
    );
  }

  getDuration(interval) {
    return this.$filter('wucDuration')(interval.toString(), 'longDate');
  }
}
