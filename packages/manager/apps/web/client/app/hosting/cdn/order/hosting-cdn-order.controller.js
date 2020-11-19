import find from 'lodash/find';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import { HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS } from './hosting-cdn-order.constant';

export default class {
  /* @ngInject */
  constructor($filter, $timeout, $translate) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.cdn1Price = null;
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

    const cdn1Addon = this.catalogAddons.addons.find(
      (addon) =>
        addon.planCode ===
        HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS,
    );
    this.cdn1Price = find(cdn1Addon.pricings, ({ capacities }) =>
      capacities.includes('renew'),
    );
  }

  resetCart() {
    if (this.cart) {
      this.cart = undefined;
      this.cartId = undefined;
      this.addonPlan = undefined;
      this.serviceId = undefined;
    }
  }

  async prepareCheckout() {
    this.trackClick('web::hosting::cdn::order::next');
    if (!this.cart && !this.checkoutLoading) {
      this.checkoutLoading = true;
      const { cart, cartId, addonPlan, serviceId } = await this.prepareCart();

      this.$timeout(() => {
        this.cart = cart;
        this.cartId = cartId;
        this.addonPlan = addonPlan;
        this.serviceId = serviceId;
        this.checkoutLoading = false;
      });
    }
  }

  checkout() {
    this.trackClick('web::hosting::cdn::order::confirm');
    this.checkoutcheckoutLoading = true;
    return !this.hasCDN ? this.checkoutToOrder() : this.checkoutToUpgrade();
  }

  checkoutToOrder() {
    return this.checkoutCart(!!this.defaultPaymentMethod, this.cartId);
  }

  checkoutToUpgrade() {
    return this.checkoutCart(
      !!this.defaultPaymentMethod,
      this.addonPlan,
      this.serviceId,
    );
  }

  getDuration(interval) {
    return this.$filter('wucDuration')(interval.toString(), 'longDate');
  }

  getButtonSubmitText() {
    if (!this.hasCDN && this.isOptionFree) {
      return this.$translate.instant('hosting_cdn_order_submit_activate');
    }
    if (this.isIncludedCDN) {
      return this.$translate.instant(
        'hosting_cdn_order_customer_cdn_included_step2_btn_ok',
      );
    }
    return this.$translate.instant('hosting_cdn_order_submit_pay');
  }

  getHeaderText() {
    if (!this.hasCDN && this.isOptionFree) {
      return this.$translate.instant(
        'hosting_cdn_order_step_header_activation',
      );
    }
    if (this.isIncludedCDN) {
      return this.$translate.instant(
        'hosting_cdn_order_customer_cdn_included_step2_header',
      );
    }
    return this.$translate.instant('hosting_cdn_order_step_header_payment');
  }
}
