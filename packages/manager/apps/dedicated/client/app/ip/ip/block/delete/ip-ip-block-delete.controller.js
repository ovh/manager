export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  Alerter,
) => {
  $scope.data = $scope.currentActionData;

  $scope.loading = false;

  $scope.deleteIpBlock = function deleteIpBlock() {
    $scope.loading = true;
    Ip.deleteIpBlock($scope.data.ipBlock.ipBlock)
      .then(
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_table_manage_delete_ipblock_success'),
            data,
          );
        },
        (reason) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_table_manage_delete_ipblock_failure', {
              t0: $scope.data.ipBlock.ipBlock,
            }),
            reason,
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
};
