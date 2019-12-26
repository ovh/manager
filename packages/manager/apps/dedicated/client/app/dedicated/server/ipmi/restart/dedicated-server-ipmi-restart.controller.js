angular
  .module('App')
  .controller(
    'ServerIpmiRestartCtrl',
    ($scope, $stateParams, $translate, Server, Alerter) => {
      $scope.loading = false;
      $scope.alert = 'server_tab_ipmi_alert';

      $scope.restartIpmi = function restartIpmi() {
        $scope.loading = true;
        Server.ipmiRestart($stateParams.productId).then(
          () => {
            $scope.resetAction();
            $scope.loading = false;
            Alerter.alertFromSWS(
              $translate.instant('server_configuration_impi_restart_loading'),
              true,
              $scope.alert,
            );
          },
          (data) => {
            $scope.resetAction();
            $scope.loading = false;
            Alerter.alertFromSWS(
              $translate.instant('server_configuration_impi_restart_error'),
              data,
              $scope.alert,
            );
          },
        );
      };
    },
  );
