export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  IpFirewall,
  Alerter,
) => {
  $scope.data = $scope.currentActionData;

  $scope.removeRule = function removeRule() {
    $scope.loading = true;
    IpFirewall.removeFirewallRule(
      $scope.data.ipBlock,
      $scope.data.ip,
      $scope.data.rule.sequence,
    )
      .then(
        (data) => {
          $rootScope.$broadcast('ips.firewall.informations.reload', data);
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_firewall_remove_rule_fail'),
            data.data,
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
};
