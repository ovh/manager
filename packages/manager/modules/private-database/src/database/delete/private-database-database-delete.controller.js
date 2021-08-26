export default class PrivateDatabaseDeleteBDDCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, PrivateDatabase) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.bddToDelete = this.$scope.currentActionData;

    this.$scope.deleteBDD = () => this.deleteBDD();
  }

  deleteBDD() {
    this.$scope.resetAction();

    this.privateDatabaseService
      .deleteBDD(this.productId, this.bddToDelete.databaseName)
      .then(() => {
        this.alerter.success(
          this.$translate.instant('privateDatabase_delete_bdd_success'),
          this.$scope.alerts.main,
        );
      })
      .catch(() => {
        this.alerter.error(
          this.$translate.instant('privateDatabase_delete_bdd_fail'),
          this.$scope.alerts.main,
        );
      });
  }
}
