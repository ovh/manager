export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  CdnDomain,
  Alerter,
) => {
  $scope.alert = 'cdn_domain_tab_rules_alert';
  $scope.cacheRule = $scope.currentActionData;

  $scope.flushRule = function flushRule() {
    $scope.resetAction();
    CdnDomain.flushRule(
      $stateParams.productId,
      $stateParams.domain,
      $scope.cacheRule,
    )
      .then(() =>
        Alerter.alertFromSWS(
          $translate.instant('cdn_configuration_flush_rule_success'),
          true,
          $scope.alert,
        ),
      )
      .catch((err) =>
        Alerter.alertFromSWS(
          $translate.instant('cdn_configuration_add_rule_error', {
            t0: $scope.cacheRule.fileMatch,
          }),
          err,
          $scope.alert,
        ),
      );
  };
};
