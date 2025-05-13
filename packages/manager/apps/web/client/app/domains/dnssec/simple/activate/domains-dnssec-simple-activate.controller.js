angular.module('App').controller(
  'DomainsDnssecSimpleActivateCtrl',
  class DomainsDnssecSimpleActivateCtrl {
    /* @ngInject */
    constructor($scope, $translate, DomainsDnsSec, Alerter) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.DomainsDnsSec = DomainsDnsSec;
      this.Alerter = Alerter;
    }

    $onInit() {
      this.selectedDomain = this.$scope.currentActionData;

      this.$scope.updateDnssec = () => {
        this.$scope.resetAction();
        this.DomainsDnsSec.updateDnssecState(true, [this.selectedDomain.name])
          .then((data) =>
            this.Alerter.alertFromSWSBatchResult(
              {
                OK: this.$translate.instant(
                  'domains_configuration_dnssec_simple_activate_success',
                ),
                ERROR: this.$translate.instant(
                  'domains_configuration_dnssec_simple_activate_fail',
                ),
              },
              data,
              this.$scope.alerts.main,
            ),
          )
          .catch((err) =>
            this.Alerter.alertFromSWS(
              this.$translate.instant(
                'domains_configuration_dnssec_simple_activate_fail',
              ),
              err,
              this.$scope.alerts.main,
            ),
          );
      };
    }
  },
);
