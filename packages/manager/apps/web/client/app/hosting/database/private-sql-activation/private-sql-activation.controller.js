import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';

export default class PrivateSqlActivationController {
  /* @ngInject */
  constructor($q, $translate, OrderService, OvhApiHostingWeb) {
    this.$q = $q;
    this.$translate = $translate;
    this.OrderService = OrderService;
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

    if (!this.availability) {
      this.goToHosting();
    }

    this.autoPayWithPreferredPaymentMethod = false;
    this.acceptContracts = false;

    if (this.hosting) {
      this.onHostingChange();
    }
  }

  onHostingChange() {
    this.loading.hosting = true;
    this.error.hosting = null;
    this.option = undefined;
    return this.$q.all([
      this.fetchDataCenter(),
      this.fetchOptions(),
    ]).catch((error) => {
      this.error.hosting = error;
    }).finally(() => {
      this.loading.hosting = false;
    });
  }

  fetchOptions() {
    return this.OrderService
      .getProductServiceOptions('webHosting', this.hosting)
      .then(options => filter(options, option => option.planCode.startsWith('private-sql')))
      .then((options) => {
        this.options = map(options, option => ({
          value: option,
          // label: `${option.planCode}  - ${option.prices[0].price.text}`,
          label: this.$translate.instant(`privatesql_activation_option_${option.planCode}`),
        }));
        return this.options;
      });
  }

  fetchDataCenter() {
    return this.OvhApiHostingWeb.v6().get({
      serviceName: this.hosting,
    }).$promise
      .then(({ datacenter }) => {
        this.datacenter = datacenter;
        return datacenter;
      });
  }

  fetchCheckoutInformations() {
    const price = find(this.option.value.prices, { pricingMode: 'default' });
    this.loading.checkout = true;
    this.error.checkout = null;
    return this.OrderService.createNewCart(this.me.ovhSubsidiary)
      .then(({ cartId }) => cartId)
      .then(cartId => this.OrderService.assignCart(cartId).then(() => cartId))
      .then(cartId => this.OrderService.addProductServiceOptionToCart(cartId, 'webHosting', this.hosting, {
        duration: price.duration,
        planCode: this.option.value.planCode,
        pricingMode: price.pricingMode,
        quantity: price.minimumQuantity,
      }).then(({ itemId }) => ({ itemId, cartId })))
      .then(({ itemId, cartId }) => this.OrderService
        .addConfigurationItem(cartId, itemId, 'dc', this.datacenter)
        .then(() => ({ itemId, cartId })))
      .then(({ itemId, cartId }) => this.OrderService
        .addConfigurationItem(cartId, itemId, 'engine', this.version.id)
        .then(() => cartId))
      .then(cartId => this.OrderService
        .getCheckoutInformations(cartId).then(checkout => ({ cartId, checkout })))
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
    return this.OrderService
      .checkoutCart(this.cartId, {
        autoPayWithPreferredPaymentMethod: this.autoPayWithPreferredPaymentMethod,
        waiveRetractionPeriod: false,
      })
      .then(({ url }) => {
        if (this.autoPayWithPreferredPaymentMethod) {
          this.success = this.$translate.instant('privatesql_activation_success_bc', { bcUrl: url });
        } else {
          this.success = this.$translate.instant('privatesql_activation_success', { billUrl: url });
        }
      })
      .catch((error) => {
        this.error.checkout = error;
      })
      .finally(() => {
        this.loading.checkout = false;
      });
  }
}
