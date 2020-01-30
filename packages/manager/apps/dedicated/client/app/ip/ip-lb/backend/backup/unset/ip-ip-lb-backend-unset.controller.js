angular
  .module('Module.ip.controllers')
  .controller(
    'IplbBackendUnsetBackupStateCtrl',
    ($scope, $rootScope, $translate, Iplb, Alerter) => {
      $scope.data = $scope.currentActionData; // service

      $scope.model = {
        backupStateSet: false,
      };

      $scope.loading = false;

      /* Action */

      $scope.unsetBackupState = function unsetBackupState() {
        $scope.loading = true;
        Iplb.setBackupState(
          $scope.data.selectedIplb.value,
          $scope.data.backend.backend,
          $scope.model,
        )
          .then(
            (task) => {
              Iplb.polldelBackend({
                serviceName: $scope.data.selectedIplb.value,
                taskId: task.id,
                taskFunction: task.action,
              });
            },
            (reason) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_backend_backupStateUnset_failure'),
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
