angular
  .module('Module.ip.controllers')
  .controller(
    'IplbPortsRedirectionDeleteCtrl',
    ($scope, $rootScope, $translate, Iplb, Alerter, $stateParams) => {
      $scope.data = $scope.currentActionData; // service

      $scope.loading = false;

      /* Action */

      $scope.deletePortsRedirection = function deletePortsRedirection() {
        $scope.loading = true;
        Iplb.deletePortsRedirection(
          $scope.data.selectedIplb.value,
          $scope.data.srcPort,
        )
          .then(
            (task) => {
              Iplb.pollPortList({
                serviceName: $stateParams.serviceName,
                taskId: task.id,
                taskFunction: task.action,
              });
              Alerter.success(
                $translate.instant('iplb_portsredirection_delete_success'),
              );
            },
            (reason) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_portsredirection_delete_failure'),
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
