import difference from 'lodash/difference';

angular
  .module('Module.ip.controllers')
  .controller(
    'IplbBackendSetProbeCtrl',
    ($scope, $rootScope, $translate, Ip, Iplb, Alerter) => {
      $scope.data = $scope.currentActionData; // service

      $scope.model = {};

      $scope.loading = true;

      Ip.getIpModels().then((models) => {
        $scope.probes = difference(
          models['ip.LoadBalancingBackendProbeEnum'].enum,
          [$scope.data.backend.probe],
        );
        $scope.loading = false;
      });

      $scope.orderByProbeAlias = function orderByProbeAlias(a) {
        const result = $translate.instant(
          `iplb_backend_probe_${a.toUpperCase()}`,
        );
        return result === 'iplb_backend_probe_' ? a.toUpperCase() : result;
      };

      /* Action */

      $scope.setProbe = function setProbe() {
        $scope.loading = true;
        Iplb.putBackend(
          $scope.data.selectedIplb.value,
          $scope.data.backend.backend,
          {
            probe: $scope.model.probe,
          },
        )
          .then(
            () => {
              $rootScope.$broadcast('iplb.backends.needUpdate');
            },
            (reason) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_backend_setprobe_failure'),
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
