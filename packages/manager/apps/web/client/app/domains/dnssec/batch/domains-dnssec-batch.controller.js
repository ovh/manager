angular.module('App').controller(
  'DomainsDnssecBatchCtrl',
  class DomainsDnssecBatchCtrl {
    /* @ngInject */
    constructor($scope, $translate, DomainsDnsSec, Alerter, WucUser) {
      this.$scope = $scope;
      this.DomainsDnsSec = DomainsDnsSec;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.WucUser = WucUser;
    }

    $onInit() {
      this.selected = {
        domainsNames: this.$scope.getSelectedDomains(),
        state: null,
      };

      this.WucUser.getUrlOf('dnssec_service')
        .then((link) => {
          this.dnssec_service_url = link;
        })
        .catch(() => {
          this.dnssec_service_url = null;
        });

      this.$scope.updateDnssec = () => {
        this.$scope.resetAction();
        return this.DomainsDnsSec.updateDnssecState(
          this.selected.state,
          this.selected.domainsNames,
        )
          .then((data) =>
            this.Alerter.alertFromSWSBatchResult(
              {
                OK: this.$translate.instant(
                  'domains_configuration_dnssec_batch_success',
                ),
                PARTIAL: this.$translate.instant(
                  'domains_configuration_dnssec_batch_partial',
                ),
                ERROR: this.$translate.instant(
                  'domains_configuration_dnssec_batch_fail',
                ),
              },
              data,
              this.$scope.alerts.main,
            ),
          )
          .catch((err) =>
            this.Alerter.alertFromSWS(
              this.$translate.instant(
                'domains_configuration_dnssec_batch_fail',
              ),
              err,
              this.$scope.alerts.main,
            ),
          );
      };
    }
  },
);
