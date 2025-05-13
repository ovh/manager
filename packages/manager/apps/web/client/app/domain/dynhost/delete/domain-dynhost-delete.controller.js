angular.module('App').controller(
  'DomainDynHostDeleteCtrl',
  class DomainDynHostDeleteCtrl {
    /* @ngInject */
    constructor($scope, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.dynHost = angular.copy(this.$scope.currentActionData.dynHost);
      this.zoneName = angular.copy(this.$scope.currentActionData.zoneName);

      this.loading = false;

      this.$scope.deleteDynHost = () => this.deleteDynHost();
    }

    deleteDynHost() {
      this.loading = true;
      return this.Domain.deleteDynHost(this.zoneName, this.dynHost.id)
        .then(() =>
          this.Domain.refreshZoneState(this.zoneName).then(() =>
            this.Alerter.success(
              this.$translate.instant('domain_tab_DYNHOST_delete_success'),
              this.$scope.alerts.main,
            ),
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_DYNHOST_error'),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
