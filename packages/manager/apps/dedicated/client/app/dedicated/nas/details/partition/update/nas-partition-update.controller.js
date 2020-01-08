angular
  .module('App')
  .controller(
    'NasPartitionUpdateCtrl',
    ($scope, $stateParams, $translate, Nas, $rootScope, Alerter) => {
      const alerterId = 'NasAlert';

      $scope.partition = $scope.currentActionData.partition;
      $scope.currentNasPartition = $scope.currentActionData.currentNas;
      $scope.updateValue = {
        sizeP: $scope.partition.size,
      };

      $scope.checkSize = function checkSize() {
        if ($scope.updateValue.sizeP) {
          $scope.updateValue.sizeP = parseInt(
            $scope.updateValue.sizeP.toString().replace('.', ''),
            10,
          );
        }
      };

      $scope.updateSize = function updateSize() {
        $scope.resetAction();
        Nas.updatePartitionSize(
          $stateParams.nasId,
          $scope.partition.partitionName,
          $scope.updateValue.sizeP,
        )
          .then(() => {
            $rootScope.$broadcast('nas_launch_task');
            Alerter.success(
              $translate.instant('nas_partitions_action_update_success', {
                t0: $scope.partition.partitionName,
              }),
              alerterId,
            );
          })
          .catch((data) =>
            Alerter.alertFromSWS(
              $translate.instant('nas_partitions_action_update_failure', {
                t0: $scope.partition.partitionName,
              }),
              data,
              alerterId,
            ),
          );
      };
    },
  );
