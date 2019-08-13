angular.module('App').controller(
  'HostingDatabaseDeleteCtrl',
  class HostingDatabaseDeleteCtrl {
    constructor($scope, $stateParams, $translate, HostingDatabase, Alerter) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.HostingDatabase = HostingDatabase;
      this.Alerter = Alerter;
    }

    $onInit() {
      this.entryToDelete = this.$scope.currentActionData;
      this.$scope.deleteDatabase = () => this.deleteDatabase();
    }

    deleteDatabase() {
      this.HostingDatabase.deleteDatabase(
        this.$stateParams.productId,
        this.entryToDelete,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant('hosting_tab_DATABASES_configuration_delete_success'),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          _.set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_DATABASES_configuration_delete_fail', {
              t0: this.entryToDelete,
            }),
            _.get(err, 'data', err),
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  },
);
