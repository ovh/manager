import filter from 'lodash/filter';
import find from 'lodash/find';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

import {
  WEB_HOSTING_SERVICE_NAME,
  WEB_HOSTING_EMAIL_FAMILY_NAME,
  WEB_HOSTING_EMAIL_PRICING_MODE_DEFAULT,
  WEB_HOSTING_CONF_ITEM_LEGACY_DOMAIN,
} from './activate/activate.constants';

export default class HostingEmailService {
  /* @ngInject */
  constructor($translate, OrderCartService, OvhApiHostingWeb, OvhApiOrder) {
    this.$translate = $translate;
    this.OrderService = OrderCartService;
    this.OvhApiHostingWebEmailOption = OvhApiHostingWeb.EmailOption().v6();
    this.OvhApiOrderCart = OvhApiOrder.Cart().v6();
  }

  getEmailOptionList(serviceName) {
    return this.OvhApiHostingWebEmailOption.query({
      serviceName,
    }).$promise.catch((error) => {
      // 460 occurs when hosting is expired
      if (error.status === 460) {
        return [];
      }

      return error;
    });
  }

  getEmailOptionServiceInformation(serviceName, emailOptionId) {
    return this.OvhApiHostingWebEmailOption.serviceInfo({
      id: emailOptionId,
      serviceName,
    }).$promise;
  }

  createCart(ovhSubsidiary) {
    return this.OrderService.createNewCart(ovhSubsidiary);
  }

  assignCart(cart) {
    return this.OrderService.assignCart(cart.cartId).then(() => cart);
  }

  getEmailServiceOptions(cart, serviceName) {
    return this.OrderService.getProductServiceOptions(
      WEB_HOSTING_SERVICE_NAME,
      serviceName,
    ).then((options) => {
      const option = filter(
        options,
        (optn) =>
          optn.family === WEB_HOSTING_EMAIL_FAMILY_NAME &&
          !isEmpty(
            filter(
              optn.prices,
              (price) =>
                price.pricingMode === WEB_HOSTING_EMAIL_PRICING_MODE_DEFAULT,
            ),
          ),
      );
      return { cart, option: option[0] };
    });
  }

  addServiceOption(cart, serviceName, option) {
    const price = find(option.prices, ({ capacities }) =>
      includes(capacities, 'renew'),
    );
    const options = {
      duration: price.duration,
      planCode: option.planCode,
      pricingMode: price.pricingMode,
      quantity: price.minimumQuantity,
    };
    return this.OrderService.addProductServiceOptionToCart(
      cart.cartId,
      WEB_HOSTING_SERVICE_NAME,
      serviceName,
      options,
    );
  }

  addConfig(cart, serviceName) {
    return this.OrderService.addConfigurationItem(
      cart.cartId,
      cart.itemId,
      WEB_HOSTING_CONF_ITEM_LEGACY_DOMAIN,
      serviceName,
    ).then(() => cart);
  }

  getCheckoutInfo(cart) {
    return this.OrderService.getCheckoutInformations(cart.cartId);
  }

  prepareCart(ovhSubsidiary, serviceName, domainName) {
    return this.createCart(ovhSubsidiary)
      .then((cart) => this.assignCart(cart))
      .then((cart) => this.getEmailServiceOptions(cart, serviceName))
      .then(({ cart, option }) =>
        this.addServiceOption(cart, serviceName, option),
      )
      .then((cart) => this.addConfig(cart, domainName))
      .then((cart) =>
        this.getCheckoutInfo(cart).then((order) => ({ ...order, cart })),
      );
  }

  orderCart(cart, options = {}) {
    return this.OrderService.checkoutCart(cart.cartId, options).then(
      (order) => {
        this.OvhApiHostingWebEmailOption.resetQueryCache();
        return order;
      },
    );
  }
}
