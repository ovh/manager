import get from 'lodash/get';

angular.module('App').controller(
  'HostingUserLogsModifyCtrl',
  class HostingUserLogsModifyCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, Hosting) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
    }

    $onInit() {
      this.model = {
        user: angular.copy(this.$scope.currentActionData),
      };

      this.$scope.modifyUser = () => this.modifyUser();
    }

    modifyUser() {
      this.$scope.resetAction();
      return this.Hosting.modifyUserLogs(
        this.$stateParams.productId,
        this.model.user.ownLogsId,
        this.model.user.login,
        this.model.user.description,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_USER_LOGS_configuration_user_modify_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_USER_LOGS_configuration_user_modify_fail',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }
  },
);
