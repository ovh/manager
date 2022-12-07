export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  IpArp,
  Alerter,
) => {
  $scope.data = $scope.currentActionData;
  $scope.loading = true;

  IpArp.getArpDetails($scope.data.ipBlock.ipBlock, $scope.data.ip.ip)
    .then((details) => {
      $scope.details = details;
    })
    .finally(() => {
      $scope.loading = false;
    });

  $scope.unblockArp = function unblockArp() {
    $scope.loading = true;
    IpArp.unblockIp($scope.data.ipBlock.ipBlock, $scope.data.ip.ip)
      .then(
        () => {
          $rootScope.$broadcast('ips.table.refreshBlock', $scope.data.ipBlock);
          Alerter.success($translate.instant('ip_arp_unblock_success'));
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_arp_unblock_failure'),
            data,
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
};
