export default class DomainDnsAnycastActivateCtrl {
  /* @ngInject */
  constructor($translate, $window, Alerter, atInternet, Domain) {
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
    this.Domain = Domain;
  }

  $onInit() {
    this.domainName = this.domainName;
    this.domainId = this.domainName;
    this.optionName = 'dnsAnycast';
    this.loading = false;
    this.loadOptionDetails();
  }

  loadOptionDetails() {
    this.loading = true;
    this.error = null;

    return this.Domain
      .getOptionDetails(this.domainId, this.optionName)
      .then((data) => {
        this.optionDetails = data;
      })
      .catch(() => {
        this.error = this.$translate.instant('domain_configuration_dnsanycast_fail');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  orderDnsanycast() {
    this.url = null;
    this.error = null;
    this.loading = true;

    return this.Domain
      .orderOption(this.domainId, this.optionName, this.optionDetails.duration.duration)
      .then((order) => {
        this.order = order;
        this.url = order.url;
      })
      .catch(() => {
        this.error = this.$translate.instant('domain_configuration_dnsanycast_fail');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  displayBC() {
    this.atInternet.trackOrder({
      name: `[domain]::${this.optionName}[${this.optionName}]`,
      page: 'web::payment-pending',
      orderId: this.order.orderId,
      priceTaxFree: this.order.prices.withoutTax.value,
      price: this.order.prices.withTax.value,
      status: 1,
    });
    this.goToDns().then(() => {
      this.Alerter.success(this.$translate.instant('domain_order_dns_anycast_success', { t0: this.url }), 'domain_alert_main');
    });
    this.$window.open(this.url, '_blank');
  }
}
