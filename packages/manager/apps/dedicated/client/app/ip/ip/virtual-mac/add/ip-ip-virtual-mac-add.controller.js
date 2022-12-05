import get from 'lodash/get';

export default /* @ngInject */ (
  $http,
  $q,
  $rootScope,
  $scope,
  $timeout,
  $translate,
  Ip,
  IpVirtualMac,
  Alerter,
  atInternet,
) => {
  $scope.data = $scope.currentActionData; // service and sub
  atInternet.trackPage({
    name: $scope.data?.tracking,
  });
  $scope.serviceName = get($scope, 'data.ipBlock.service.serviceName');

  $scope.model = {
    choice: 'new',
  };

  $scope.loading = true;
  $scope.existingVirtualMacs = [];

  $q.all({
    fetchModels: Ip.getServerModels().then((models) => {
      $scope.types = models['dedicated.server.VmacTypeEnum'].enum;
    }),
    fetchVirtualMacs: $http
      .get(`/dedicated/server/${$scope.serviceName}/virtualMac`)
      .then(({ data: virtualMacs }) => {
        $scope.existingVirtualMacs = virtualMacs;
      }),
  }).finally(() => {
    $scope.loading = false;
  });

  /* Action */

  $scope.addVirtualMac = function addVirtualMac() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::confirm`,
      type: 'action',
    });
    $scope.loading = true;
    if ($scope.model.choice === 'new') {
      IpVirtualMac.addVirtualMacToIp(
        $scope.serviceName,
        $scope.data.ip.ip,
        $scope.model.type,
        $scope.model.virtualMachineName,
      )
        .then(() => $timeout(angular.noop, 1000)) // add some delay for task to be created
        .then(() => {
          $rootScope.$broadcast('ips.table.refresh');
          Alerter.success(
            $translate.instant('ip_virtualmac_add_new_success', {
              t0: $scope.data.ip.ip,
            }),
          );
        })
        .catch((reason) => {
          Alerter.error(`
                ${$translate.instant('ip_virtualmac_add_new_failure', {
                  t0: $scope.data.ip.ip,
                })}
              <br />
              ${reason.message}`);
        })
        .finally(() => {
          $scope.resetAction();
        });
    } else {
      IpVirtualMac.addIpToVirtualMac(
        $scope.serviceName,
        $scope.model.macAddress,
        $scope.data.ip.ip,
        $scope.model.virtualMachineName,
      )
        .then(() => $timeout(angular.noop, 1000)) // add some delay for task to be created
        .then(() => {
          $rootScope.$broadcast('ips.table.refresh');
          Alerter.success(
            $translate.instant('ip_virtualmac_add_existing_success', {
              t0: $scope.data.ip.ip,
            }),
          );
        })
        .catch((reason) =>
          Alerter.error(`
                ${$translate.instant('ip_virtualmac_add_existing_failure', {
                  t0: $scope.data.ip.ip,
                })}
              <br />
              ${reason.message}`),
        )
        .finally(() => $scope.resetAction());
    }
  };

  $scope.isValid = function isValid() {
    switch ($scope.model.choice) {
      case 'new':
        return $scope.model.type && $scope.model.virtualMachineName;
      case 'existing':
        return $scope.model.macAddress && $scope.model.virtualMachineName;
      default:
        return false;
    }
  };

  $scope.cancelAction = function cancelAction() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::cancel`,
      type: 'action',
    });
    $scope.resetAction();
  };
};
