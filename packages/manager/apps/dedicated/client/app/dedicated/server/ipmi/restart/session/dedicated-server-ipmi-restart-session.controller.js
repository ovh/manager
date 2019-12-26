angular
  .module('App')
  .controller(
    'ServerIpmiRestartSessionsCtrl',
    ($scope, $stateParams, $translate, Server, Alerter) => {
      $scope.loading = false;
      $scope.alert = 'server_tab_ipmi_alert';

      $scope.ipmiSessions = function ipmiSessions() {
        $scope.loading = true;
        Server.ipmiSessionsReset($stateParams.productId).then(
          () => {
            $scope.resetAction();
            $scope.loading = false;
            Alerter.alertFromSWS(
              $translate.instant('server_configuration_impi_sessions_loading'),
              null,
              $scope.alert,
            );
          },
          (data) => {
            $scope.resetAction();
            $scope.loading = false;
            Alerter.alertFromSWS(
              $translate.instant('server_configuration_impi_sessions_error'),
              data.data,
              $scope.alert,
            );
          },
        );
      };
    },
  );
