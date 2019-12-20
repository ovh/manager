import get from 'lodash/get';

export default class EmailDomainUpgradeCtrl {
  /* @ngInject */
  constructor($translate, $window, Alerter, EmailDomainService) {
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.EmailDomainService = EmailDomainService;
  }

  $onInit() {
    this.alerts = {
      main: 'webEmailDomainUpgrade.alerts.main',
    };

    this.model = {
      offer: null,
      agree: false,
    };

    this.loading = {
      upgrading: false,
    };
  }

  upgrade() {
    this.loading.upgrading = true;
    this.Alerter.resetMessage(this.alerts.main);
    return this.EmailDomainService.upgrade(
      this.serviceName,
      this.model.offer.name,
      this.model.offer.duration.name,
    )
      .then((order) => {
        this.goBack(
          this.$translate.instant('email_domain_upgrade_success', {
            orderUrl: order.url,
            orderId: order.orderId,
          }),
        );
        this.$window.open(order.url, '_blank', 'noopener');
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('email_domain_upgrade_error', {
            message: get(error, 'data.message', error.message),
          }),
          this.alerts.main,
        );
      })
      .finally(() => {
        this.loading.upgrading = false;
      });
  }
}
