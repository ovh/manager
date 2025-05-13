export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  Housing,
  Alerter,
) => {
  $scope.getRebootPrices = function getRebootPrices() {
    $scope.loading = true;
    Housing.getRebootPrices($stateParams.productId)
      .then(
        (contract) => {
          $scope.contract = contract;
        },
        (err) => {
          Alerter.alertFromSWS(
            $translate.instant('housing_configuration_reboot_fail_apcinfo'),
            err,
            'housing_tab_reboot_alert',
          );
        },
      )
      .finally(() => {
        $scope.loading = false;
      });
  };

  $scope.reboot = function reboot() {
    $scope.loading = true;
    Housing.rebootOrder($stateParams.productId)
      .then(
        (order) => {
          Alerter.success(
            $translate.instant('housing_configuration_reboot_success', {
              t0: 'housing_dashboard_alert',
            }),
          );
          window.open(order.url, '_blank').focus();
        },
        (err) => {
          Alerter.alertFromSWS(
            $translate.instant('housing_configuration_reboot_fail'),
            err,
            'housing_dashboard_alert',
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
        $scope.loading = false;
      });
  };
};
