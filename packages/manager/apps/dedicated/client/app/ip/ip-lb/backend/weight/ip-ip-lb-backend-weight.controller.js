angular
  .module('Module.ip.controllers')
  .controller(
    'IplbBackendSetWeightCtrl',
    ($scope, $rootScope, $translate, Iplb, Alerter) => {
      $scope.data = $scope.currentActionData; // service

      $scope.model = {};

      $scope.loading = false;

      /* Action */

      $scope.setWeight = function setWeight() {
        if (
          $scope.data.backend &&
          $scope.data.backend.weight === $scope.model.weight
        ) {
          Alerter.success($translate.instant('iplb_backend_setweight_success'));
          $scope.resetAction();
          return;
        }

        $scope.loading = true;
        Iplb.setWeight(
          $scope.data.selectedIplb.value,
          $scope.data.backend.backend,
          $scope.model.weight,
        )
          .then(
            (task) => {
              Iplb.polldelBackend({
                serviceName: $scope.data.selectedIplb.value,
                taskId: task.id,
                taskFunction: task.action,
              });
            },
            (reason) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_backend_setweight_failure'),
                reason,
              );
            },
          )
          .finally(() => {
            $scope.resetAction();
          });
      };
    },
  );
