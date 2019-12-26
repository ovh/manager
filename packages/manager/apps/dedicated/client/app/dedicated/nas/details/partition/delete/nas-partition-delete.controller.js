angular
  .module('App')
  .controller(
    'NasPartitionDeleteCtrl',
    ($scope, $stateParams, $translate, Nas, $rootScope, Alerter) => {
      const alerterId = 'NasAlert';

      $scope.toDelete = $scope.currentActionData;

      $scope.deletePartition = function deletePartition() {
        $scope.resetAction();
        Nas.deletePartition($stateParams.nasId, $scope.toDelete.partitionName)
          .then((task) => {
            $rootScope.$broadcast('nas_launch_task', task);
            Alerter.success(
              $translate.instant('nas_partitions_action_delete_success', {
                t0: $scope.toDelete.partitionName,
              }),
              alerterId,
            );
          })
          .catch((err) =>
            Alerter.alertFromSWS(
              $translate.instant('nas_partitions_action_delete_failure', {
                t0: $scope.toDelete.partitionName,
              }),
              err,
              alerterId,
            ),
          );
      };
    },
  );
