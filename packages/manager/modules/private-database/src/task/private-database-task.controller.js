export default class PrivateDatabaseTasksCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, PrivateDatabase) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.productId = $stateParams.productId;
    this.privateDatabaseService = PrivateDatabase;
    this.alerter = Alerter;
  }

  $onInit() {
    this.getTasks();
  }

  getTasks() {
    this.taskDetails = null;

    return this.privateDatabaseService
      .getTasks(this.productId)
      .then((ids) => {
        this.taskDetails = ids.sort((a, b) => b - a).map((id) => ({ id }));
      })
      .catch(() => {
        this.alerter.error(
          this.$translate.instant('privateDatabase_configuration_error'),
          this.$scope.alerts.main,
        );
      });
  }

  transformItem(item) {
    return this.privateDatabaseService
      .getTaskDetails(this.productId, item.id)
      .catch(() => {
        this.alerter.error(
          this.$translate.instant('privateDatabase_configuration_error'),
          this.$scope.alerts.main,
        );
      });
  }
}
