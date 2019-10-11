export default class DedicatedServerInterfacesOlaActivationCtrl {
  /* @ngInject */
  constructor($translate, $window, OvhApiOrderCart) {
    this.$translate = $translate;
    this.$window = $window;
    this.CartService = OvhApiOrderCart;
  }

  $onInit() {
    this.cartId = null;
    this.autoPay = false;
    this.orderUrl = null;
    this.loading = true;

    this.activateText = this.$translate.instant('dedicated_server_interfaces_ola_activation_confirm');
    this.seeOrderText = this.$translate.instant('dedicated_server_interfaces_ola_see_order_button');
    this.cancelText = this.$translate.instant('dedicated_server_interfaces_ola_activation_cancel');

    this.cartPromise = this.CartService.v6().post({
      ovhSubsidiary: this.user.ovhSubsidiary,
    }).$promise
      .then((cart) => {
        this.cartId = cart.cartId;
        return this.CartService.v6().assign({ cartId: this.cartId }).$promise;
      })
      .then(() => this.CartService.ServiceOption().v6().post({
        productName: 'baremetalServers',
        serviceName: this.serverName,
        planCode: 'ovh-link-aggregation-infra',
        duration: 'P1M',
        pricingMode: 'default',
        quantity: 1,
        cartId: this.cartId,
      }).$promise)
      .then(() => this.CartService.v6().summary({ cartId: this.cartId }).$promise)
      .then((summary) => {
        this.prices = summary.prices;
        this.loading = false;
      })
      .catch((error) => {
        this.goBack().then(() => this.alertError('server_error_ola_activation', error.data));
      });
  }

  activate() {
    this.loading = true;
    this.atTrack('activate_ola');
    return this.cartPromise
      .then(() => this.CartService.v6().checkout({ cartId: this.cartId }, {
        autoPayWithPreferredPaymentMethod: this.autoPay,
      }).$promise)
      .then((order) => {
        this.orderUrl = order.url;
        this.loading = false;
      })
      .catch((error) => {
        this.goBack().then(() => this.alertError('server_error_ola_activation', error.data));
      });
  }

  currentAction() {
    if (this.orderUrl) {
      this.$window.open(this.orderUrl, '_blank');
      return;
    }
    this.activate();
  }

  currentActionLabel() {
    return this.orderUrl ? this.seeOrderText : this.activateText;
  }

  currentCancelLabel() {
    return this.orderUrl ? null : this.cancelText;
  }
}
