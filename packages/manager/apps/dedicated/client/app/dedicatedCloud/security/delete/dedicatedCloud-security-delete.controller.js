import find from 'lodash/find';

angular
  .module('App')
  .controller(
    'DedicatedCloudSecurityPolicyDeleteCtrl',
    ($scope, $stateParams, DedicatedCloud, $translate, Alerter) => {
      const { policies } = $scope.currentActionData;

      $scope.entriesToDelete = $scope.currentActionData.selectedPolicies;

      $scope.deleteEntries = function deleteEntries() {
        $scope.resetAction();
        DedicatedCloud[
          $scope.entriesToDelete.length > 1
            ? 'deleteSecurityPolicies'
            : 'deleteSecurityPolicy'
        ]($stateParams.productId, $scope.entriesToDelete)
          .then(() =>
            Alerter.success(
              $scope.entriesToDelete.length > 1
                ? $translate.instant(
                    'dedicatedCloud_configuration_SECURITY_policy_delete_success_other',
                  )
                : $translate.instant(
                    'dedicatedCloud_configuration_SECURITY_policy_delete_success_one',
                  ),
              'dedicatedCloud',
            ),
          )
          .catch((err) =>
            Alerter.alertFromSWS(
              $scope.entriesToDelete.length > 1
                ? $translate.instant(
                    'dedicatedCloud_configuration_SECURITY_policy_delete_fail_other',
                  )
                : $translate.instant(
                    'dedicatedCloud_configuration_SECURITY_policy_delete_fail_one',
                  ),
              err,
              'dedicatedCloud',
            ),
          );
      };

      $scope.getPolicyIP = function getPolicyIP(id) {
        return find(policies, { id }).network;
      };
    },
  );
