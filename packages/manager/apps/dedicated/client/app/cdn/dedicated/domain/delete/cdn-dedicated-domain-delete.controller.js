export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  CdnDomain,
) => {
  $scope.domain = $stateParams.domain;

  $scope.deleteEntry = function deleteEntry() {
    $scope.resetAction();
    CdnDomain.deleteDomain($stateParams.productId, $stateParams.domain).then(
      () => {
        $scope.setMessage(
          $translate.instant('cdn_configuration_delete_domain_success'),
          true,
        );
      },
      (data) => {
        $scope.setMessage(
          $translate.instant('cdn_configuration_delete_domain_fail'),
          angular.extend(data, { type: 'ERROR' }),
        );
      },
    );
  };
};
