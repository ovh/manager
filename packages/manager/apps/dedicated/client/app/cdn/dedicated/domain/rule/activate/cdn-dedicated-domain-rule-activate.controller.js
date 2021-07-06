export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  CdnDomain,
  Alerter,
) => {
  $scope.alert = 'cdn_domain_tab_rules_alert';
  $scope.entry = $scope.currentActionData;

  $scope.activate = function activate() {
    $scope.resetAction();
    CdnDomain.updateCacheruleStatus(
      $stateParams.productId,
      $stateParams.domain,
      $scope.entry.id,
      'ON',
    ).then(
      () => {
        Alerter.alertFromSWS(
          $translate.instant('cdn_configuration_cacherule_activate_success'),
          true,
          $scope.alert,
        );
      },
      (data) => {
        Alerter.alertFromSWS(
          $translate.instant('cdn_configuration_cacherule_activate_fail'),
          data,
          $scope.alert,
        );
      },
    );
  };
};
