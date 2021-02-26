import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import map from 'lodash/map';

export default class PrivateSqlActivationController {
  /* @ngInject */
  constructor($q, $translate, OrderCartService, OvhApiHostingWeb) {
    this.$q = $q;
    this.$translate = $translate;
    this.OrderCartService = OrderCartService;
    this.OvhApiHostingWeb = OvhApiHostingWeb;
  }

  $onInit() {
    this.loading = {
      hosting: false,
      checkout: false,
    };
    this.error = {
      hosting: null,
      checkout: null,
    };

    this.acceptContracts = false;

    if (this.hosting) {
      this.onHostingChange();
    }
  }

  onHostingChange() {
    this.loading.hosting = true;
    this.error.hosting = null;
    this.option = undefined;
    this.options = map(this.privateSqlOptions, (option) => {
      const price = get(
        find(option.prices, { pricingMode: 'default' }),
        'price.text',
      );
      const planLabel = this.$translate.instant(
        `privatesql_activation_option_${option.planCode}`,
      );
      return {
        value: option,
        label: `${planLabel} - ${price}`,
      };
    });
    return this.fetchDataCenter()
      .catch((error) => {
        this.error.hosting = error;
      })
      .finally(() => {
        this.loading.hosting = false;
      });
  }

  fetchDataCenter() {
    return this.OvhApiHostingWeb.v6()
      .get({
        serviceName: this.hosting,
      })
      .$promise.then(({ datacenter }) => {
        this.datacenter = datacenter;
        return datacenter;
      });
  }

  fetchCheckoutInformations() {
    const price = find(this.option.value.prices, ({ capacities }) =>
      includes(capacities, 'renew'),
    );
    this.loading.checkout = true;
    this.error.checkout = null;
    return this.OrderCartService.createNewCart(this.me.ovhSubsidiary)
      .then(({ cartId }) => cartId)
      .then((cartId) =>
        this.OrderCartService.assignCart(cartId).then(() => cartId),
      )
      .then((cartId) =>
        this.OrderCartService.addProductServiceOptionToCart(
          cartId,
          'webHosting',
          this.hosting,
          {
            duration: price.duration,
            planCode: this.option.value.planCode,
            pricingMode: price.pricingMode,
            quantity: price.minimumQuantity,
          },
        ).then(({ itemId }) => ({ itemId, cartId })),
      )
      .then(({ itemId, cartId }) =>
        this.OrderCartService.addConfigurationItem(
          cartId,
          itemId,
          'dc',
          this.datacenter,
        ).then(() => ({ itemId, cartId })),
      )
      .then(({ itemId, cartId }) =>
        this.OrderCartService.addConfigurationItem(
          cartId,
          itemId,
          'engine',
          this.version.id,
        ).then(() => cartId),
      )
      .then((cartId) =>
        this.OrderCartService.getCheckoutInformations(
          cartId,
        ).then((checkout) => ({ cartId, checkout })),
      )
      .then(({ cartId, checkout }) => {
        this.checkout = checkout;
        this.cartId = cartId;
      })
      .catch((error) => {
        this.error.checkout = error;
      })
      .finally(() => {
        this.loading.checkout = false;
      });
  }

  performCheckout() {
    this.loading.checkout = true;
    this.error.checkout = null;
    return this.OrderCartService.checkoutCart(this.cartId, {
      autoPayWithPreferredPaymentMethod: false,
      waiveRetractionPeriod: false,
    })
      .then(({ url }) => {
        this.success = this.$translate.instant(
          'privatesql_activation_success',
          { billUrl: url },
        );
      })
      .catch((error) => {
        this.error.checkout = error;
      })
      .finally(() => {
        this.loading.checkout = false;
      });
  }
}
