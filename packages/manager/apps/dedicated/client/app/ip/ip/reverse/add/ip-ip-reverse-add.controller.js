export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  IpReverse,
  Alerter,
  Validator,
) => {
  $scope.data = $scope.currentActionData;
  $scope.model = { ipv6: null, reverse: null };

  /* Action */

  $scope.addIpv6 = function addIpv6() {
    IpReverse.updateReverse(
      $scope.data.ipBlock,
      $scope.model.ipv6,
      $scope.model.reverse,
    )
      .then(() =>
        $rootScope.$broadcast('ips.table.refreshBlock', $scope.data.ipBlock),
      )
      .catch((reason) =>
        Alerter.alertFromSWS(
          $translate.instant('ip_table_manage_add_ipv6block_failure'),
          reason,
        ),
      );

    $scope.resetAction();
  };

  $scope.isValid = {
    ipv6() {
      return Validator.isValidIpv6($scope.model.ipv6);
    },
    reverse() {
      return Validator.isValidDomain($scope.model.reverse.replace(/\.$/, ''));
    },
    all() {
      return $scope.isValid.ipv6() && $scope.isValid.reverse();
    },
  };
};
