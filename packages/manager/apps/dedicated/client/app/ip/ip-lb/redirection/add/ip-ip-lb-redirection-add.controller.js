import difference from 'lodash/difference';

angular.module('Module.ip.controllers').controller('IplbPortsRedirectionAddCtrl', ($scope, $rootScope, $q, $translate, Ip, Iplb, Alerter) => {
  $scope.data = $scope.currentActionData; // service

  $scope.model = {};

  $scope.loading = true;

  Ip.getIpModels().then((models) => {
    $scope.allowedSrcPorts = difference(models['ip.LoadBalancingAdditionalPortEnum'].enum.map((i) => +i), $scope.data.portsRedirectionIds);
    $scope.loading = false;
  });

  /* Action */

  $scope.addPortsRedirection = function addPortsRedirection() {
    $scope.loading = true;
    Iplb.addPortsRedirection($scope.data.value, $scope.model)
      .then(
        (task) => {
          Iplb.pollPortList({
            serviceName: $scope.data.value,
            taskId: task.id,
            taskFunction: task.action,
          });
          Alerter.success($translate.instant('iplb_portsredirection_add_success'));
        },
        (reason) => {
          Alerter.alertFromSWS($translate.instant('iplb_portsredirection_add_failure'), reason);
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
});
