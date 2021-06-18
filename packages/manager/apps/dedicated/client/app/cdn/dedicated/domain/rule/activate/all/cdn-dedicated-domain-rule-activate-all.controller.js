export default /* @ngInject */ (
  $scope,
  $translate,
  CdnDomain,
  Alerter,
  $stateParams,
) => {
  const resultMessages = {
    OK: $translate.instant('cdn_configuration_allcacherule_activate_success'),
    PARTIAL: $translate.instant(
      'cdn_configuration_allcacherule_activate_partial',
    ),
    ERROR: $translate.instant('cdn_configuration_allcacherule_activate_fail'),
  };
  $scope.alert = 'cdn_domain_tab_rules_alert';

  $scope.activate = function activate() {
    $scope.resetAction();
    CdnDomain.updateAllCacheruleStatus(
      $stateParams.productId,
      $stateParams.domain,
      'ON',
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
