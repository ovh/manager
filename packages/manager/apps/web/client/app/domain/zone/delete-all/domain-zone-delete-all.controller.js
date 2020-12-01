angular.module('App').controller(
  'DomainZoneDeleteAllCtrl',
  class DomainZoneDeleteAllCtrl {
    constructor($scope, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.alerter = Alerter;
      this.domainService = Domain;
    }

    $onInit() {
      this.domain = this.$scope.currentActionData;
      this.loading = false;
      this.$scope.deleteAllZone = () => this.deleteAllZone();
    }

    deleteAllZone() {
      this.loading = true;
      return this.domainService
        .deleteAllZone(this.domain.name)
        .then(() =>
          this.alerter.success(
            this.$translate.instant(
              'domain_configuration_zonedns_delete_all_success',
            ),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'domain_configuration_zonedns_delete_all_error',
            ),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  },
);
