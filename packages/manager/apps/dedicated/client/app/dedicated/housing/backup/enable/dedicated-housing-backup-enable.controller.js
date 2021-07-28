// --------------ENABLE BACKUP------------------

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  Housing,
  Alerter,
) => {
  const alert = 'housing_tab_ftpbackup_alert';

  $scope.loading = false;

  $scope.activateFtpBackup = function activateFtpBackup() {
    $scope.loading = true;

    Housing.activateFtpBackup($stateParams.productId)
      .then(
        () => {
          Alerter.success(
            $translate.instant(
              'housing_configuration_ftpbackup_activate_success',
            ),
            alert,
          );
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant(
              'housing_configuration_ftpbackup_activate_failure',
            ),
            data,
            alert,
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
};
