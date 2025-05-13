import get from 'lodash/get';

angular.module('App').controller(
  'HostingFtpUserDeleteCtrl',
  class HostingFtpUserDeleteCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, HostingUser) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.HostingUser = HostingUser;
    }

    $onInit() {
      this.entryToDelete = this.$scope.currentActionData;

      this.$scope.deleteUser = () => this.deleteUser();
    }

    deleteUser() {
      this.$scope.resetAction();
      return this.HostingUser.deleteUser(
        this.$stateParams.productId,
        this.entryToDelete,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_DATABASES_configuration_user_delete_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_DATABASES_configuration_user_delete_fail',
              { t0: this.entryToDelete },
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }
  },
);
