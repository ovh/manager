// --------------RENEW PASSWORD------------------

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  Housing,
  Alerter,
) => {
  const alert = 'housing_tab_ftpbackup_alert';
  $scope.ftpBackup = $scope.currentActionData;
  $scope.loading = false;

  $scope.requestFtpBackupPassword = function requestFtpBackupPassword() {
    $scope.loading = true;

    Housing.requestFtpBackupPassword($stateParams.productId)
      .then(
        () => {
          Alerter.success(
            $translate.instant(
              'housing_configuration_ftpbackup_lost_password_success',
            ),
            alert,
          );
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant(
              'housing_configuration_ftpbackup_lost_password_failure',
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
