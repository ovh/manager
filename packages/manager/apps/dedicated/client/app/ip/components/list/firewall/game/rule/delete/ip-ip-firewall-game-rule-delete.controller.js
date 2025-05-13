export default /* @ngInject */ function RemoveGameFirewallRuleCtrl(
  $scope,
  $translate,
  Ip,
  $rootScope,
  Alerter,
  IpGameFirewall,
  atInternet,
) {
  const self = this;
  const alert = 'ip_game_firewall_alert';

  self.datas = $scope.currentActionData;
  self.loading = false;

  atInternet.trackClick({
    name: self.datas.tracking,
    type: 'action',
  });

  $scope.removeGameFirewallRule = function removeGameFirewallRule() {
    self.loading = true;

    atInternet.trackClick({
      name: `${self.datas.tracking}-confirm`,
      type: 'action',
    });

    IpGameFirewall.deleteRule(
      self.datas.ipblock,
      self.datas.ip,
      self.datas.rule.id,
    )
      .then(
        () => {
          Alerter.success(
            $translate.instant('ip_game_mitigation_rule_remove_success'),
            alert,
          );
          $rootScope.$broadcast(
            'ips.gameFirewall.display.remove',
            self.datas.rule.id,
          );
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_game_mitigation_rule_remove_error'),
            data,
            alert,
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };

  $scope.cancelDelete = function cancelDelete() {
    atInternet.trackClick({
      name: `${self.datas.tracking}-cancel`,
      type: 'action',
    });
    $scope.resetAction();
  };
}
