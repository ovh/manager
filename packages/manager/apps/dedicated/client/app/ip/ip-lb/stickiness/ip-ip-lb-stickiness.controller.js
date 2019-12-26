angular
  .module('Module.ip.controllers')
  .controller(
    'IplbSetStickinessCtrl',
    ($scope, $rootScope, $translate, Iplb, Alerter) => {
      $scope.data = $scope.currentActionData; // service
      $scope.model = {
        choice: $scope.data.infos.stickiness,
      };

      $scope.loading = false;

      /* Action */

      $scope.setStickiness = function setStickiness() {
        $scope.loading = true;
        Iplb.setStickiness($scope.data.value, $scope.model.choice)
          .then(
            () => {
              Alerter.success(
                $translate.instant('iplb_stickiness_set_success'),
              );
            },
            (reason) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_stickiness_set_failure'),
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
