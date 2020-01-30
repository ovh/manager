angular
  .module('App')
  .controller(
    'DedicatedCloudSecurityPolicyModifyCtrl',
    ($scope, $stateParams, DedicatedCloud, $translate, REGEX) => {
      $scope.entryToModify = angular.copy($scope.currentActionData);
      $scope.regex = REGEX;

      $scope.modifyEntry = function modifyEntry() {
        $scope.resetAction();
        DedicatedCloud.modifySecurityPolicy(
          $stateParams.productId,
          $scope.entryToModify,
        ).then(
          () => {
            $scope.setMessage(
              $translate.instant(
                'dedicatedCloud_configuration_SECURITY_policy_modify_success',
              ),
              true,
            );
          },
          (data) => {
            $scope.setMessage(
              $translate.instant(
                'dedicatedCloud_configuration_SECURITY_policy_modify_fail',
                {
                  t0: $scope.currentActionData.network,
                },
              ),
              data,
            );
          },
        );
      };

      function init() {
        $scope.entryToModify.network = $scope.entryToModify.network.replace(
          /\/[0-9]+/,
          '',
        );
      }

      init();
    },
  );
