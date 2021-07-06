export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  CdnDomain,
  Alerter,
) => {
  $scope.alert = 'cdn_domain_tab_rules_alert';
  $scope.entry = $scope.currentActionData;
  $scope.newEntry = {
    ttl: null,
  };

  $scope.modify = function modify() {
    $scope.resetAction();
    CdnDomain.updateCacheruleTtl(
      $stateParams.productId,
      $stateParams.domain,
      $scope.entry.id,
      $scope.newEntry.ttl,
    )
      .then(() =>
        Alerter.alertFromSWS(
          $translate.instant('cdn_configuration_cacherule_update_success'),
          true,
          $scope.alert,
        ),
      )
      .catch((data) =>
        Alerter.alertFromSWS(
          $translate.instant('cdn_configuration_cacherule_update_fail'),
          data,
          $scope.alert,
        ),
      );
  };
};
