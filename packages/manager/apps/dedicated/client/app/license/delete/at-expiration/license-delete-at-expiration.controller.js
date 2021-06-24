export default /* @ngInject */ (
  $scope,
  $translate,
  $rootScope,
  License,
  Alerter,
) => {
  $scope.license = $scope.currentActionData.license;

  /**
   * Toggle delete at expiration serviceInfos.
   * @return {Promise}
   */
  $scope.toggleDeleteAtExpiration = () =>
    License.deleteLicenseAtExpiration($scope.license)
      .then(() => {
        Alerter.alertFromSWS(
          $translate.instant('license_details_update_success'),
        );
        $rootScope.$broadcast('License.Details.Refresh');
      })
      .catch((err) =>
        Alerter.alertFromSWS(
          $translate.instant('license_details_update_fail'),
          err,
        ),
      )
      .finally(() => {
        $scope.resetAction();
      });
};
