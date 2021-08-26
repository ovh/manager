import get from 'lodash/get';

export default class PrivateDatabaseRestartCtrl {
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

    this.$scope.restartDatabase = () => this.restartDatabase();
  }

  restartDatabase() {
    this.$scope.resetAction();
    this.privateDatabaseService
      .restartDatabase(this.productId)
      .then((task) => {
        this.$scope.pollAction(task);
        this.alerter.success(
          this.$translate.instant('privateDatabase_restart_success'),
          this.$scope.alerts.main,
        );
      })
      .catch((err) => {
        this.alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_restart_fail'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      });
  }
}
