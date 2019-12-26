{
  class DedicatedCloudSecurityPolicyLogoutCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, DedicatedCloud) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.DedicatedCloud = DedicatedCloud;
    }

    $onInit() {
      this.selectedLogoutPolicy = {
        value: null,
      };

      this.$scope.modifyPolicyLogout = () => this.modifyPolicyLogout();
    }

    modifyPolicyLogout() {
      this.$scope.resetAction();

      return this.DedicatedCloud.modifyPolicyLogout(
        this.$stateParams.productId,
        this.selectedLogoutPolicy.value,
      )
        .then((data) => {
          this.$scope.setMessage(
            this.$translate.instant(
              'dedicatedCloud_configuration_SECURITY_policy_logout_success',
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
              'dedicatedCloud_configuration_SECURITY_policy_logout_fail',
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
      'DedicatedCloudSecurityPolicyLogoutCtrl',
      DedicatedCloudSecurityPolicyLogoutCtrl,
    );
}
