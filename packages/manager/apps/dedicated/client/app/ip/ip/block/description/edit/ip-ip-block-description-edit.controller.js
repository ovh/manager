export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  Alerter,
) => {
  $scope.data = $scope.currentActionData;
  $scope.model = { description: null };
  $scope.loading = false;

  if ($scope.data && $scope.data.ipBlock && $scope.data.ipBlock.description) {
    $scope.model.description = angular.copy($scope.data.ipBlock.description);
  }

  $scope.$watch('model.description', (newValue) => {
    $scope.availableChar = `${newValue ? newValue.length : 0}/255`;
  });

  /* Action */

  $scope.editIpDescription = function editIpDescription() {
    $scope.loading = true;
    Ip.editIpDescription(
      $scope.data.ipBlock.ipBlock,
      $scope.model.description || '',
    )
      .then(
        () => {
          $scope.data.ipBlock.description = $scope.model.description;
          Alerter.success(
            $translate.instant('ip_description_edit_success', {
              t0: $scope.data.ipBlock.ipBlock,
            }),
          );
        },
        (reason) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_description_edit_failure', {
              t0: $scope.data.ipBlock.ipBlock,
            }),
            reason,
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
};
