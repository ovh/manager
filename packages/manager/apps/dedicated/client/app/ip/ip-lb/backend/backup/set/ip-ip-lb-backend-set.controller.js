import difference from 'lodash/difference';

angular
  .module('Module.ip.controllers')
  .controller(
    'IplbBackendSetBackupStateCtrl',
    ($scope, $rootScope, $translate, Iplb, Alerter, $q) => {
      function haveNextBackend(backend, promise, ignoredBackend) {
        return Iplb.whoIsMyBackend(
          $scope.data.selectedIplb.value,
          backend,
        ).then((next) => {
          if (next && next.backend) {
            ignoredBackend.push(next.backend);
            haveNextBackend(next.backend, promise, ignoredBackend);
          } else {
            promise.resolve(ignoredBackend);
          }
        });
      }

      function initIgnoredBackend(backend) {
        const deferred = $q.defer();
        const ignoredBackend = [];

        $scope.loadingAvailableBackends = true;

        ignoredBackend.push(backend);

        haveNextBackend(backend, deferred, ignoredBackend);

        return deferred.promise;
      }

      $scope.data = $scope.currentActionData; // service

      $scope.model = {
        backupStateSet: true,
      };

      $scope.loading = false;
      $scope.loadingAvailableBackends = false;

      initIgnoredBackend($scope.data.backend.backend).then((data) => {
        $scope.allowedBackendsIds = difference(
          $scope.data.selectedIplb.backendIds,
          data,
        );
        $scope.loadingAvailableBackends = false;
      });

      /* Action */

      $scope.setBackupState = function setBackupState() {
        $scope.loading = true;
        Iplb.setBackupState(
          $scope.data.selectedIplb.value,
          $scope.data.backend.backend,
          $scope.model,
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
                $translate.instant('iplb_backend_backupStateSet_failure'),
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
