import set from 'lodash/set';

angular
  .module('App')
  .controller(
    'ServerFirewallAsaDisableCtrl',
    ($scope, $stateParams, $translate, Server, ServerFirewallAsa, Alerter) => {
      $scope.model = null;

      $scope.load = function load() {
        Server.getSelected($stateParams.productId).then(
          (data) => {
            $scope.model = data;
          },
          (data) => {
            $scope.resetAction();
            set(data, 'type', 'ERROR');
            $scope.setMessage(
              $translate.instant(
                'server_configuration_firewall_asa_disable_step1_loading_error',
              ),
              data,
            );
          },
        );
      };

      $scope.disable = function disable() {
        $scope.resetAction();
        ServerFirewallAsa.changeFirewallState($stateParams.productId, false)
          .then(() =>
            Alerter.success(
              $translate.instant(
                'server_configuration_firewall_asa_disable_success',
              ),
              'dedicated_server_firewall',
            ),
          )
          .catch((err) =>
            Alerter.alertFromSWS(
              $translate.instant(
                'server_configuration_firewall_asa_disable_fail',
              ),
              err,
              'dedicated_server_firewall',
            ),
          );
      };
    },
  );
