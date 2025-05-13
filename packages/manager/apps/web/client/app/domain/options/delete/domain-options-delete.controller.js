angular.module('controllers').controller(
  'controllers.Domain.Options.Delete',
  class DomainDnsLockCtrl {
    /* @ngInject */
    constructor($rootScope, $scope, $translate, Alerter, Domain) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.loading = false;
      this.domain = this.$scope.currentActionData.domain;
      this.option = this.$scope.currentActionData.option;
    }

    closeModal() {
      this.$scope.resetAction();
    }

    deleteDomain() {
      this.loading = true;
      return this.Domain.deleteOption(this.domain.name, this.option.option)
        .then(() =>
          this.Alerter.success(
            this.$translate.instant('domain_tab_options_delete_success'),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_options_delete_error'),
            { ...err, type: err.type || 'ERROR' },
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading = false;
          this.Domain.resetOptionsCache();
          this.$rootScope.$broadcast('Domain.Options.Delete');
          this.$scope.resetAction();
        });
    }
  },
);
