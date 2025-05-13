angular.module('App').controller(
  'controllers.Hosting.Envvars.delete',
  class HostingEnvvarsDeleteCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, HostingEnvvars) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.HostingEnvvars = HostingEnvvars;
    }

    $onInit() {
      this.entryToDelete = angular.copy(this.$scope.currentActionData).envvar;

      this.$scope.delete = () => this.delete();
    }

    delete() {
      return this.HostingEnvvars.delete(
        this.$stateParams.productId,
        this.entryToDelete.key,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant('hosting_tab_ENVVARS_delete_success'),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.error(
            this.$translate.instant('hosting_tab_ENVVARS_delete_error') +
              err.message,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  },
);
