angular
  .module('Billing.controllers')
  .controller('billingAutoRenewDisable', class BillingAutoRenewDisable {
    constructor($scope, $translate, Alerter, atInternet, BillingAutoRenew, AUTORENEW_EVENT) {
      this.$scope = $scope;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.atInternet = atInternet;
      this.BillingAutoRenew = BillingAutoRenew;

      this.AUTORENEW_EVENT = AUTORENEW_EVENT;
    }

    $onInit() {
      this.$scope.disableAutoRenewForDomains = () => this.disableAutoRenewForDomains();
    }

    disableAutoRenewForDomains() {
      return this.BillingAutoRenew
        .disableAutoRenewForDomains()
        .then(() => {
          this.$scope.$emit(this.AUTORENEW_EVENT.DISABLE_AUTOMATIC_PAYMENT_FOR_DOMAINS);
          this.Alerter.set('alert-success', this.$translate.instant('autorenew_service_disable_all_domains_success'));
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(this.$translate.instant('autorenew_service_update_step2_error'), err);
        })
        .finally(() => {
          this.$scope.resetAction();
          this.atInternet.trackClick({
            name: 'validation_autoRenew_domains',
            type: 'action',
            chapter1: 'services',
            chapter2: 'autoRenew',
          });
        });
    }
  });
