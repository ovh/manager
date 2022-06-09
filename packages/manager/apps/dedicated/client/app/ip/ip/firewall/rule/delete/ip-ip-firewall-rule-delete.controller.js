export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  IpFirewall,
  Alerter,
  atInternet,
) => {
  $scope.data = $scope.currentActionData;
  atInternet.trackClick({
    name: $scope.data?.tracking,
    type: 'action',
  });
  $scope.removeRule = function removeRule() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::confirm`,
      type: 'action',
    });
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
  $scope.cancelAction = function cancelAction() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::cancel`,
      type: 'action',
    });
    $scope.resetAction();
  };
};
