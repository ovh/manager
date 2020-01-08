angular
  .module('Module.ip.controllers')
  .controller(
    'IplbRestoreSslCtrl',
    ($scope, $rootScope, $translate, Iplb, Alerter) => {
      $scope.data = $scope.currentActionData; // service

      $scope.loading = false;

      /* Action */

      $scope.restoreSsl = function restoreSsl() {
        $scope.loading = true;
        Iplb.restoreSsl($scope.data.value)
          .then(
            () => {
              Alerter.success($translate.instant('iplb_ssl_restore_success'));
            },
            (reason) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_ssl_restore_failure'),
                reason,
              );
            },
          )
          .finally(() => {
            $scope.resetAction();
          });
      };
    },
  );
