angular.module('App').controller(
  'DomainDnsAnycastActivateCtrl',
  class DomainDnsAnycastActivateCtrl {
    constructor($scope, $stateParams, $translate, $window, Alerter, atInternet, Domain) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$window = $window;
      this.Alerter = Alerter;
      this.atInternet = atInternet;
      this.Domain = Domain;
    }

    $onInit() {
      this.domainName = this.$stateParams.productId;
      this.optionName = 'dnsAnycast';
      this.loading = false;

      this.$scope.orderDnsanycast = () => this.orderDnsanycast();
      this.$scope.displayBC = () => this.displayBC();

      this.loadOptionDetails();
    }

    loadOptionDetails() {
      this.loading = true;
      return this.Domain
        .getOptionDetails(this.domainName, this.optionName)
        .then((data) => {
          this.optionDetails = data;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(this.$translate.instant('domain_configuration_dnsanycast_fail'), _.get(err, 'data', err), this.$scope.alerts.main);
          this.$scope.resetAction();
        })
        .finally(() => {
          this.loading = false;
        });
    }

    orderDnsanycast() {
      this.url = null;
      this.loading = true;

      return this.Domain
        .orderOption(this.domainName, this.optionName, this.optionDetails.duration.duration)
        .then((order) => {
          this.order = order;
          this.url = order.url;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(this.$translate.instant('domain_configuration_dnsanycast_fail'), _.get(err, 'data', err), this.$scope.alerts.main);
          this.$scope.resetAction();
        })
        .finally(() => {
          this.loading = false;
        });
    }

    displayBC() {
      this.$scope.resetAction();
      this.atInternet.trackOrder({
        name: `[domain]::${this.optionName}[${this.optionName}]`,
        page: 'web::payment-pending',
        orderId: this.order.orderId,
        priceTaxFree: this.order.prices.withoutTax.value,
        price: this.order.prices.withTax.value,
        status: 1,
      });
      this.Alerter.success(this.$translate.instant('domain_order_dns_anycast_success', { t0: this.url }), this.$scope.alerts.main);
      this.$window.open(this.url, '_blank');
    }
  },
);
