import { TRACKING_PREFIX } from '../../../ip-ip.constant';

export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  Alerter,
  atInternet,
) => {
  $scope.data = $scope.currentActionData;
  $scope.model = { description: null };
  $scope.loading = false;
  $scope.cancelExport = () => this.cancelExport();

  if ($scope.data && $scope.data.ipBlock && $scope.data.ipBlock.description) {
    $scope.model.description = angular.copy($scope.data.ipBlock.description);
  }

  $scope.$watch('model.description', (newValue) => {
    $scope.availableChar = `${newValue ? newValue.length : 0}/255`;
  });

  /* Action */

  $scope.editIpDescription = function editIpDescription() {
    atInternet.trackClick({
      name: `${TRACKING_PREFIX}::edit-description::confirm`,
      type: 'action',
    });
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

  $scope.cancelDescription = function cancelDescription() {
    atInternet.trackClick({
      name: `${TRACKING_PREFIX}::edit-description::cancel`,
      type: 'action',
    });
    $scope.resetAction();
  };
};
