angular
  .module('Module.ip.controllers')
  .controller(
    'IplbImportCustomSslCtrl',
    ($scope, $rootScope, $translate, Iplb, Alerter) => {
      $scope.data = $scope.currentActionData; // service
      $scope.model = {};

      $scope.loading = false;

      /* Action */

      $scope.importCustomSsl = function importCustomSsl() {
        $scope.loading = true;
        Iplb.importCustomSsl($scope.data.value, $scope.model)
          .then(
            () => {
              Alerter.success($translate.instant('iplb_ssl_import_success'));
            },
            (reason) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_ssl_import_failure'),
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
