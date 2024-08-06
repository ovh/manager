angular.module('App').controller(
  'DomainsDnssecSimpleDeactivateCtrl',
  class DomainsDnssecSimpleDeactivateCtrl {
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
        this.DomainsDnsSec.updateDnssecState(false, [this.selectedDomain.name])
          .then((data) =>
            this.Alerter.alertFromSWSBatchResult(
              {
                OK: this.$translate.instant(
                  'domains_configuration_dnssec_simple_deactivate_success',
                ),
                ERROR: this.$translate.instant(
                  'domains_configuration_dnssec_simple_deactivate_fail',
                ),
              },
              data,
              this.$scope.alerts.main,
            ),
          )
          .catch((err) =>
            this.Alerter.alertFromSWS(
              this.$translate.instant(
                'domains_configuration_dnssec_simple_deactivate_fail',
              ),
              err,
              this.$scope.alerts.main,
            ),
          );
      };
    }
  },
);
