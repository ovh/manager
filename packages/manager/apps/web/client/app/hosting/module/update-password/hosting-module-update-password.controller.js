import get from 'lodash/get';

angular.module('App').controller(
  'HostingModuleChangePasswordCtrl',
  class HostingModuleChangePasswordCtrl {
    constructor($scope, $stateParams, $translate, Alerter, HostingModule) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.HostingModule = HostingModule;
    }

    $onInit() {
      this.moduleToUpdate = this.$scope.currentActionData;
      this.$scope.updatePasswordModule = () => this.updatePasswordModule();
    }

    updatePasswordModule() {
      this.$scope.resetAction();
      return this.HostingModule.changePassword(
        this.$stateParams.productId,
        this.moduleToUpdate.id,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_configuration_tab_modules_update_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_configuration_tab_modules_update_fail',
              {
                t0: this.moduleToUpdate,
              },
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
          this.$scope.resetActions();
        });
    }
  },
);
