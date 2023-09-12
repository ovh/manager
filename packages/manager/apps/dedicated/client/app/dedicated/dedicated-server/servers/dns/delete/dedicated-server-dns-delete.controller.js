import set from 'lodash/set';

angular
  .module('App')
  .controller(
    'DeleteSecondaryDnsCtrl',
    ($scope, $stateParams, $translate, Server) => {
      $scope.secdns = $scope.currentActionData;
      $scope.loadingDelete = false;

      $scope.deleteSecondaryDns = function deleteSecondaryDns() {
        $scope.loadingDelete = true;
        Server.deleteSecondaryDns(
          $stateParams.productId,
          $scope.secdns.domain,
        ).then(
          () => {
            $scope.loadingDelete = false;
            $scope.resetAction();
            $scope.setMessage(
              $translate.instant(
                'server_configuration_delete_secondary_dns_success',
                { t0: $scope.secdns.domain },
              ),
              true,
            );
          },
          (err) => {
            $scope.loadingDelete = false;
            $scope.resetAction();
            set(err, 'type', 'ERROR');
            $scope.setMessage(
              $translate.instant(
                'server_configuration_delete_secondary_dns_fail',
                { t0: $scope.secdns.domain },
              ),
              err,
            );
          },
        );
      };
    },
  );
