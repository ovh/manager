export default /* @ngInject */ function EnableDisableGameFirewallRuleCtrl(
  $scope,
  $translate,
  Ip,
  IpGameFirewall,
  $rootScope,
  Alerter,
) {
  const self = this;
  const alert = 'ip_game_firewall_alert';

  self.datas = $scope.currentActionData;
  self.loading = false;

  $scope.enableDisableGameFirewallRule = function enableDisableGameFirewallRule() {
    self.loading = true;

    IpGameFirewall.putFirewall(
      self.datas.ipblock,
      self.datas.ip,
      !self.datas.firewall.firewallModeEnabled,
    )
      .then(
        () => {
          Alerter.success(
            $translate.instant(
              `ip_game_mitigation_firewall_enable_success_${self.datas.firewall.firewallModeEnabled}`,
            ),
            alert,
          );
          $rootScope.$broadcast('ips.gameFirewall.display.firewall');
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant(
              `ip_game_mitigation_firewall_enable_error_${self.datas.firewall.firewallModeEnabled}`,
            ),
            data,
            alert,
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
}
