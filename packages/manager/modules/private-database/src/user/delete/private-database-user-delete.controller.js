export default class PrivateDatabaseDeleteUserCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, PrivateDatabase) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.PrivateDatabase = PrivateDatabase;
  }

  $onInit() {
    this.userToDelete = this.$scope.currentActionData;
    this.$scope.deleteUser = () => this.deleteUser();
  }

  deleteUser() {
    this.$scope.resetAction();
    return this.PrivateDatabase.deleteUser(
      this.$stateParams.productId,
      this.userToDelete.userName,
    )
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('privateDatabase_delete_user_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch(() =>
        this.Alerter.error(
          this.$translate.instant('privateDatabase_delete_user_fail'),
          this.$scope.alerts.main,
        ),
      );
  }
}
