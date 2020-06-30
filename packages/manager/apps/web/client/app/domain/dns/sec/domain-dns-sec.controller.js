import get from 'lodash/get';

angular.module('controllers').controller(
  'Domain.controllers.DnsSec',
  class DomainDnsSecCtrl {
    /* @ngInject */
    constructor(
      $rootScope,
      $scope,
      $state,
      $translate,
      Alerter,
      DomainsDnsSec,
    ) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$state = $state;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.DomainsDnsSec = DomainsDnsSec;
    }

    $onInit() {
      this.domain = angular.copy(this.$scope.currentActionData);

      this.$scope.changeDnsSecState = () => this.changeDnsSecState();
      this.$scope.resetSwitchAndAction = () => this.resetSwitchAndAction();
    }

    changeDnsSecState() {
      const newState = this.domain.dnssecStatus !== 'ENABLED';
      return this.DomainsDnsSec.updateDnssecState(newState, [this.domain.name])
        .then((data) => {
          if (data.state !== 'OK') {
            return this.Alerter.alertFromSWS(
              this.$translate.instant(
                `domain_configuration_dnssec_error_${newState}`,
              ),
              data,
              this.$scope.alerts.main,
            );
          }

          return this.Alerter.alertFromSWS(
            this.$translate.instant(
              `domain_configuration_dnssec_ok_${newState}`,
            ),
            data,
            this.$scope.alerts.main,
          );
        })
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              `domain_configuration_dnssec_error_${newState}`,
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.$scope.$emit('domain.dashboard.refresh');
          this.$scope.resetAction();
        });
    }

    resetSwitchAndAction() {
      this.$rootScope.$broadcast('domain.dnssec.lock.unlock.cancel');
      this.$scope.resetAction();
    }
  },
);
