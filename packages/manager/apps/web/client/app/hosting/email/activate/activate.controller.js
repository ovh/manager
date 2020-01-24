import get from 'lodash/get';

export default class EmailOfferActivateCtrl {
  /* @ngInject */
  constructor($translate, hostingEmailService, Alerter, MANAGER_URLS) {
    this.$translate = $translate;
    this.hostingEmailService = hostingEmailService;
    this.Alerter = Alerter;
    this.MANAGER_URLS = MANAGER_URLS;
  }

  $onInit() {
    this.alerts = {
      main: 'activateEmailAddress.alerts.main',
    };
    this.createCartInProgress = false;
    this.checkoutCartInProgress = false;
    this.contractsAccepted = false;
    this.order = null;
    this.domainName = null;
  }

  createOrder() {
    this.createCartInProgress = true;
    this.order = null;
    this.contractsAccepted = false;
    return this.hostingEmailService
      .prepareCart(this.user.ovhSubsidiary, this.serviceName, this.domainName)
      .then((order) => {
        this.order = order;
        return order;
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('hosting_email_address_activation_error', {
            message: error.message ? error.message : get(error, 'data.message'),
          }),
          this.alerts.main,
        );
      })
      .finally(() => {
        this.createCartInProgress = false;
      });
  }

  activate() {
    this.checkoutCartInProgress = true;
    return this.hostingEmailService
      .orderCart(this.order.cart)
      .then((order) =>
        this.goToHosting(
          this.$translate.instant('hosting_email_address_activation_success', {
            orderTrackURL: `${this.MANAGER_URLS.dedicated}billing/order/${order.orderId}`,
          }),
        ),
      )
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('hosting_email_address_activation_error', {
            message: get(error, 'data.message', error.message),
          }),
          this.alerts.main,
        );
      })
      .finally(() => {
        this.checkoutCartInProgress = false;
      });
  }

  cancel() {
    this.goToHosting();
  }
}
