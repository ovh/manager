export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  IpReverse,
  Alerter,
) => {
  $scope.ipBlock = $scope.currentActionData.ipBlock;
  $scope.reverse = $scope.currentActionData.reverse;

  /* Action */
  $scope.deleteIpv6ReverseDelegation = function deleteIpv6ReverseDelegation() {
    $scope.resetAction();

    IpReverse.deleteDelegation($scope.ipBlock.ipBlock, $scope.reverse).then(
      () => {
        $rootScope.$broadcast('ips.table.refreshBlock', $scope.ipBlock);
        Alerter.success(
          $translate.instant(
            'ip_table_manage_delegation_ipv6block_delete_success',
          ),
        );
      },
      (err) => {
        Alerter.alertFromSWS(
          $translate.instant('ip_table_manage_delegation_ipv6block_delete_err'),
          err,
        );
      },
    );
  };
};
