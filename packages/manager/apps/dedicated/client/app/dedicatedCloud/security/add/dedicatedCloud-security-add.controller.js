angular.module('App').controller(
  'DedicatedCloudSecurityPolicyAddCtrl',
  class {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, DedicatedCloud, REGEX) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.DedicatedCloud = DedicatedCloud;
      this.REGEX = REGEX;
    }

    $onInit() {
      this.$scope.regex = this.REGEX;
      this.$scope.newNetwork = {
        value: null,
      };
      this.$scope.addEntry = () => this.addEntry();
    }

    addEntry() {
      this.$scope.resetAction();

      return this.DedicatedCloud.addSecurityPolicy(
        this.$stateParams.productId,
        this.$scope.newNetwork,
      )
        .then(() => {
          this.$scope.setMessage(
            this.$translate.instant(
              'dedicatedCloud_configuration_SECURITY_policy_add_success',
            ),
            true,
          );
        })
        .catch((err) => {
          this.$scope.setMessage(
            this.$translate.instant(
              'dedicatedCloud_configuration_SECURITY_policy_add_fail',
              [this.$scope.newNetwork.value],
            ),
            {
              ...err,
              type: 'error',
            },
          );
        });
    }
  },
);
