angular
  .module('App')
  .controller(
    'NasPartitionAccessAddCtrl',
    ($scope, $stateParams, $translate, Nas, REGEX, $rootScope, Alerter) => {
      const alerterId = 'NasAlert';

      $scope.partitionName = $scope.currentActionData;

      $scope.newAccess = {
        ip: null,
      };

      $scope.loading = true;

      Nas.getAuthorizableIps($stateParams.nasId, $scope.partitionName)
        .then((values) => {
          $scope.authorizableIps = values;
        })
        .catch((error) => {
          $scope.resetAction();
          Alerter.alertFromSWS(
            $translate.instant('nas_ip_loading_error'),
            error,
            alerterId,
          );
        })
        .finally(() => {
          $scope.loading = false;
        });

      $scope.isValid = function isValid() {
        return (
          $scope.newAccess.ip !== null &&
          $scope.newAccess.ip.ip.match(REGEX.ROUTABLE_BLOCK_OR_IP) &&
          $scope.newAccess.ip.ip.indexOf('0.0.0.0') === -1
        );
      };

      $scope.addAccess = function addAccess() {
        $scope.resetAction();
        Nas.addAccess(
          $stateParams.nasId,
          $scope.partitionName,
          $scope.newAccess.ip.ip,
        ).then(
          (task) => {
            $rootScope.$broadcast('nas_launch_task', task);
            Alerter.success(
              $translate.instant('nas_access_action_add_success', {
                t0: $scope.newAccess.ip.ip,
              }),
              alerterId,
            );
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant('nas_access_action_add_failure', {
                t0: $scope.newAccess.ip.ip,
              }),
              data,
              alerterId,
            );
          },
        );
      };

      $scope.getLabel = function getLabel(ip) {
        return ip.ip + (ip.description ? ` - ${ip.description}` : '');
      };
    },
  );
