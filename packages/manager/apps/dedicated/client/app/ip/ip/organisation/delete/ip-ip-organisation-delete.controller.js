export default /* @ngInject */ (
  $scope,
  $translate,
  Ip,
  IpOrganisation,
  Alerter,
) => {
  $scope.alert = 'ip_organisation_alerter';
  $scope.load = false;

  $scope.deleteOrganisation = function deleteOrganisation() {
    $scope.load = true;
    IpOrganisation.deleteOrganisation($scope.currentActionData).then(
      () => {
        Alerter.alertFromSWS(
          $translate.instant('ip_organisation_delete_success'),
          true,
          $scope.alert,
        );
        $scope.resetAction();
        $scope.load = false;
      },
      (reason) => {
        Alerter.alertFromSWS(
          $translate.instant('ip_organisation_delete_error'),
          reason,
          $scope.alert,
        );
        $scope.resetAction();
        $scope.load = false;
      },
    );
  };
};
