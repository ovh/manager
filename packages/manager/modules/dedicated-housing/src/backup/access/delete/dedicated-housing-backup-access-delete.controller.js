// --------------DELETE ACCESS------------------

export default /* @ngInject */ (
  $rootScope,
  $scope,
  $stateParams,
  $translate,
  Housing,
  Alerter,
) => {
  const alert = 'housing_tab_ftpbackup_alert';

  $scope.access = $scope.currentActionData.ipBlock;
  $scope.loading = false;

  $scope.deleteAccessFtpBackup = function deleteAccessFtpBackup() {
    $scope.loading = true;

    Housing.deleteFtpBackupIp($stateParams.productId, $scope.access)
      .then(
        () => {
          Alerter.success(
            $translate.instant(
              'housing_configuration_ftpbackup_access_delete_success',
              { t0: $scope.access },
            ),
            alert,
          );
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant(
              'housing_configuration_ftpbackup_access_delete_failure',
              { t0: $scope.access },
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
