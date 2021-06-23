export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  IpAntihack,
  Alerter,
) => {
  $scope.data = $scope.currentActionData;
  $scope.loading = true;

  IpAntihack.getAntihackDetails($scope.data.ipBlock.ipBlock, $scope.data.ip.ip)
    .then((details) => {
      $scope.details = details;
    })
    .finally(() => {
      $scope.loading = false;
    });

  $scope.unblockAntihack = function unblockAntihack() {
    $scope.loading = true;
    IpAntihack.unblockIp($scope.data.ipBlock.ipBlock, $scope.data.ip.ip)
      .then(
        () => {
          $rootScope.$broadcast('ips.table.refreshBlock', $scope.data.ipBlock);
          Alerter.success($translate.instant('ip_antihack_unblock_success'));
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_antihack_unblock_failure'),
            data,
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
};
