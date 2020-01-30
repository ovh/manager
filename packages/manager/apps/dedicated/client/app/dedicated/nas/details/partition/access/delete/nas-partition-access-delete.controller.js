angular
  .module('App')
  .controller(
    'NasPartitionAccessDeleteCtrl',
    ($scope, $stateParams, $translate, Nas, $rootScope, Alerter) => {
      const alerterId = 'NasAlert';

      $scope.toDelete = $scope.currentActionData;

      $scope.deleteAccess = function deleteAccess() {
        $scope.resetAction();
        Nas.deleteAccess(
          $stateParams.nasId,
          $scope.toDelete.partitionName,
          $scope.toDelete.access,
        )
          .then((task) => {
            $rootScope.$broadcast('nas_launch_task', task);
            Alerter.success(
              $translate.instant('nas_access_action_delete_success', {
                t0: $scope.toDelete.access,
              }),
              alerterId,
            );
          })
          .catch((data) =>
            Alerter.alertFromSWS(
              $translate.instant('nas_access_action_delete_failure', {
                t0: $scope.toDelete.access,
              }),
              data,
              alerterId,
            ),
          );
      };
    },
  );
