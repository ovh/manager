angular
  .module('App')
  .controller(
    'MonitoringDeleteCtrl',
    ($rootScope, $scope, $stateParams, $translate, Server, Alerter) => {
      $scope.monitoring = $scope.currentActionData;
      $scope.loaders = {
        deleting: false,
      };

      $scope.deleteMonitoring = function deleteMonitoring() {
        $scope.loaders.deleting = true;
        Server.deleteServiceMonitoring(
          $stateParams.productId,
          $scope.monitoring.monitoringId,
        )
          .then(
            () => {
              $rootScope.$broadcast('server.monitoring.reload');
              Alerter.success(
                $translate.instant('server_tab_MONITORING_delete_success'),
                'monitoringAlert',
              );
            },
            (err) => {
              Alerter.alertFromSWS(
                $translate.instant('server_tab_MONITORING_delete_error'),
                err.data,
                'monitoringAlert',
              );
            },
          )
          .finally(() => {
            $scope.resetAction();
          });
      };
    },
  );
