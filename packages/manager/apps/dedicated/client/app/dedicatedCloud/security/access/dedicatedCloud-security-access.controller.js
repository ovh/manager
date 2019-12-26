import difference from 'lodash/difference';

{
  class DedicatedCloudSecurityPolicyAccessCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, DedicatedCloud) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.DedicatedCloud = DedicatedCloud;
    }

    $onInit() {
      this.selectedAccessPolicy = {
        policies: [],
        value: null,
      };

      this.initAvailablePolicies();

      this.$scope.modifyPolicyAccess = () => this.modifyPolicyAccess();
    }

    initAvailablePolicies() {
      this.selectedAccessPolicy.policies = angular.copy(
        this.$scope.dedicatedCloud.userAccessPolicyEnum,
      );

      if (
        this.$scope.dedicatedCloud.capabilities.userAccessPolicyStatus !==
        'ACTIVE'
      ) {
        this.selectedAccessPolicy.policies = difference(
          this.selectedAccessPolicy.policies,
          ['FILTERED'],
        );
      }
    }

    modifyPolicyAccess() {
      this.$scope.resetAction();

      return this.DedicatedCloud.modifyPolicyAccess(
        this.$stateParams.productId,
        this.selectedAccessPolicy.value,
      )
        .then((data) => {
          this.$scope.setMessage(
            this.$translate.instant(
              'dedicatedCloud_configuration_SECURITY_policy_access_success',
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
              'dedicatedCloud_configuration_SECURITY_policy_access_fail',
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
      'DedicatedCloudSecurityPolicyAccessCtrl',
      DedicatedCloudSecurityPolicyAccessCtrl,
    );
}
