{
  class DedicatedCloudSecurityUpdateSessionTimeoutCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, DedicatedCloud) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.DedicatedCloud = DedicatedCloud;
    }

    $onInit() {
      this.sessionTimeout = {
        value: null,
        current: this.$scope.currentActionData,
        never: false,
      };

      this.$scope.updateSessionTimeout = () => this.updateSessionTimeout();
    }

    updateSessionTimeout() {
      this.$scope.resetAction();

      return this.DedicatedCloud.updateSessionExpiration(
        this.$stateParams.productId,
        (this.sessionTimeout.never && '0') || this.sessionTimeout.value,
      )
        .then((data) => {
          this.$scope.setMessage(
            this.$translate.instant(
              'dedicatedCloud_configuration_SECURITY_update_session_timeout_success',
            ),
            {
              ...data,
              type: 'success',
            },
          );
        })
        .catch((err) => {
          this.$scope.setMessage(
            this.$translate.instant(
              'dedicatedCloud_configuration_SECURITY_update_session_timeout_fail',
            ),
            {
              ...err,
              type: 'error',
            },
          );
        });
    }
  }

  angular
    .module('App')
    .controller(
      'DedicatedCloudSecurityUpdateSessionTimeoutCtrl',
      DedicatedCloudSecurityUpdateSessionTimeoutCtrl,
    );
}
