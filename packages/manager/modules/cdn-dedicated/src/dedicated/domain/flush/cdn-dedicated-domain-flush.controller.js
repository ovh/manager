export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  CdnDomain,
) => {
  $scope.domain = $scope.currentActionData;

  $scope.flushDomain = function flushDomain() {
    $scope.resetAction();
    CdnDomain.flushDomain($stateParams.productId, $stateParams.domain).then(
      () => {
        $scope.setMessage(
          $translate.instant('cdn_configuration_flush_domain_success'),
          true,
        );
      },
      (data) => {
        $scope.setMessage(
          $translate.instant('cdn_configuration_add_domain_fail', {
            t0: $stateParams.domain,
          }),
          angular.extend(data, { type: 'ERROR' }),
        );
      },
    );
  };
};
