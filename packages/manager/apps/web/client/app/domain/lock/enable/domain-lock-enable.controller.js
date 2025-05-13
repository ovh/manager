import get from 'lodash/get';

angular.module('App').controller(
  'DomainLockEnableCtrl',
  class DomainLockDisableCtrl {
    /* @ngInject */
    constructor($scope, $rootScope, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.domain = angular.copy(this.$scope.currentActionData);
      this.$scope.resetSwitchAndAction = () => this.resetSwitchAndAction();
      this.$scope.lockDomain = () => this.lockDomain();
    }

    resetSwitchAndAction() {
      this.$rootScope.$broadcast('domain.protection.lock.cancel');
      this.$scope.resetAction();
    }

    lockDomain() {
      return this.Domain.changeLockState(this.domain.name, 'locked')
        .then((data) => {
          this.$rootScope.$broadcast('domain.protection.lock.done', data);
          this.Alerter.success(
            this.$translate.instant(
              'domain_configuration_protection_activate_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.$rootScope.$broadcast('domain.protection.lock.error', err);
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'domain_configuration_protection_activate_fail',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  },
);
