export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  CdnDomain,
  Alerter,
) => {
  const resultMessages = {
    OK: $translate.instant('cdn_configuration_allcacherule_deactivate_success'),
    PARTIAL: $translate.instant(
      'cdn_configuration_allcacherule_deactivate_partial',
    ),
    ERROR: $translate.instant('cdn_configuration_allcacherule_deactivate_fail'),
  };
  $scope.alert = 'cdn_domain_tab_rules_alert';

  $scope.desactivate = function desactivate() {
    $scope.resetAction();
    CdnDomain.updateAllCacheruleStatus(
      $stateParams.productId,
      $stateParams.domain,
      'OFF',
    ).then(
      (data) => {
        Alerter.alertFromSWSBatchResult(resultMessages, data, $scope.alert);
      },
      (data) => {
        Alerter.alertFromSWSBatchResult(resultMessages, data, $scope.alert);
      },
    );
  };
};
