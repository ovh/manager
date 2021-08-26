export default class PrivateDatabaseBDDsDumpsDeleteCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, PrivateDatabase) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
  }

  $onInit() {
    this.loading = false;
    this.bdd = this.$scope.currentActionData.bdd;
    this.dump = this.$scope.currentActionData.dump;
    this.$scope.deleteDump = () => this.deleteDump();
  }

  deleteDump() {
    this.loading = true;
    return this.privateDatabaseService
      .deleteDumpBDD(
        this.$stateParams.productId,
        this.bdd.databaseName,
        this.dump.id,
      )
      .catch((err) =>
        this.alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_tabs_dumps_delete_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.$scope.resetAction();
      });
  }
}
