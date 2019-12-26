angular
  .module('controllers')
  .controller(
    'controllers.Server.Stats.Rtm.Disk',
    ($scope, $stateParams, Server, Alerter) => {
      $scope.loading = true;

      Server.getPartitions($stateParams.productId).then(
        (result) => {
          $scope.partitions = result;
          $scope.loading = false;
        },
        (err) => {
          $scope.loading = false;
          Alerter.alertFromSWS('', err);
        },
      );
    },
  );
