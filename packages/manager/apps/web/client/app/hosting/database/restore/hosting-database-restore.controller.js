angular.module('App').controller(
  'HostingDatabaseRestoreCtrl',
  class HostingDatabaseRestoreCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, HostingDatabase) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.HostingDatabase = HostingDatabase;
    }

    $onInit() {
      this.bdd = angular.copy(this.$scope.currentActionData.bdd);
      this.dump = angular.copy(this.$scope.currentActionData.dump);
      this.loading = false;

      this.$scope.restoreBDD = () => this.restoreBDD();
    }

    restoreBDD() {
      this.loading = true;
      return this.HostingDatabase.restoreBDD(
        this.$stateParams.productId,
        this.bdd.name,
        this.dump,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant('database_tabs_dumps_restore_in_start'),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('database_tabs_dumps_restore_fail'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
