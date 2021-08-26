import angular from 'angular';

export default class PrivateDatabaseRestoreBDDCtrl {
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

    this.bdd = angular.copy(this.$scope.currentActionData.bdd);
    this.dump = angular.copy(this.$scope.currentActionData.dump);

    this.$scope.restoreBDD = () => this.restoreBDD();
  }

  restoreBDD() {
    this.privateDatabaseService
      .restoreBDD(this.productId, this.bdd.databaseName, this.dump.id)
      .then(() => {
        this.alerter.success(
          this.$translate.instant(
            'privateDatabase_tabs_dumps_restore_in_progress',
          ),
          this.$scope.alerts.main,
        );
      })
      .catch((err) => {
        this.alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_tabs_dumps_restore_fail'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.$scope.resetAction();
      });
  }
}
