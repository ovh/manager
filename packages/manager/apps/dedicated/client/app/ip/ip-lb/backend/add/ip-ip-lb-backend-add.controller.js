angular
  .module('Module.ip.controllers')
  .controller(
    'IplbBackendAddCtrl',
    ($scope, $rootScope, $q, $translate, Ip, Iplb, Alerter, IpRange) => {
      $scope.data = $scope.currentActionData; // service

      $scope.weightConf = {
        MIN: Iplb.BACKEND_WEIGHT_MIN,
        MAX: Iplb.BACKEND_WEIGHT_MAX,
        DEFAULT: Iplb.BACKEND_WEIGHT_DEFAULT,
      };
      $scope.model = {
        weight: $scope.weightConf.DEFAULT,
      };

      Object.defineProperty($scope, 'stepIsValid', {
        enumerable: true,
        configurable: false,
        get() {
          if ($scope.loading || $scope.isAlreadySet) {
            return false;
          }

          if (!$scope.model.ipBackend || !$scope.model.probe) {
            return false;
          }

          if (!$scope.model.weight) {
            if ($scope.model.weight === null) {
              return true;
            }
            return false;
          }

          if (
            $scope.model.weight < $scope.weightConf.MIN ||
            $scope.model.weight > $scope.weightConf.MAX
          ) {
            return false;
          }

          return true;
        },
        set() {
          throw new Error('$scope.stepIsValid is a read only lazy properties');
        },
      });
      $scope.loading = true;

      const queue = [];
      queue.push(
        Ip.getIpModels().then((models) => {
          $scope.probes = models['ip.LoadBalancingBackendProbeEnum'].enum || [];
        }),
      );
      queue.push(
        Iplb.getAllowedBackends($scope.data.value).then((ips) => {
          $scope.allowedBackends = ips || [];
        }),
      );
      $q.all(queue).finally(() => {
        $scope.loading = false;
      });

      $scope.$watch('model.ipblockBackend', (val) => {
        $scope.allowedBackendsIps = val
          ? IpRange.getRangeForIpv4Block(val)
          : [];
        $scope.model.ipBackend =
          $scope.allowedBackendsIps.length === 1
            ? $scope.allowedBackendsIps[0]
            : undefined;
      });

      if ($scope.data.backendIds && $scope.data.backendIds.length) {
        $scope.$watch('model.ipBackend', (val) => {
          $scope.isAlreadySet = ~$scope.data.backendIds.indexOf(val);
        });
      }

      $scope.orderByProbeAlias = function orderByProbeAlias(a) {
        const result = $translate.instant(
          `iplb_backend_probe_${a.toUpperCase()}`,
        );
        return result === 'iplb_backend_probe_' ? a.toUpperCase() : result;
      };

      /* Action */

      $scope.addBackend = function addBackend() {
        const dataToSend = JSON.parse(JSON.stringify($scope.model));
        delete dataToSend.ipblockBackend;

        $scope.loading = true;
        Iplb.addBackend($scope.data.value, dataToSend)
          .then(
            (task) => {
              Iplb.polladdBackend({
                serviceName: $scope.data.value,
                taskId: task.id,
                taskFunction: task.action,
              });
            },
            (reason) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_backend_addBackend_failure'),
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
