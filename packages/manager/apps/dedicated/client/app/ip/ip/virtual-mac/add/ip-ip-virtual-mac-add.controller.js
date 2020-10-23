angular
  .module('Module.ip.controllers')
  .controller(
    'IpAddVirtualMacCtrl',
    ($scope, $rootScope, $translate, Ip, IpVirtualMac, Alerter) => {
      $scope.data = $scope.currentActionData; // service and sub
      $scope.model = {
        choice: 'new',
      };

      $scope.loading = true;

      $scope.existingVirtualMacs = [];

      if (
        $scope.data.ipBlock.virtualMac &&
        $scope.data.ipBlock.virtualMac.virtualMacs
      ) {
        angular.forEach(
          $scope.data.ipBlock.virtualMac.virtualMacs,
          (virtualmac) => {
            $scope.existingVirtualMacs.push(virtualmac);
          },
        );
      }

      Ip.getServerModels().then((models) => {
        $scope.types = models['dedicated.server.VmacTypeEnum'].enum;
        $scope.loading = false;
      });

      /* Action */

      $scope.addVirtualMac = function addVirtualMac() {
        $scope.loading = true;
        if ($scope.model.choice === 'new') {
          IpVirtualMac.addVirtualMacToIp(
            $scope.data.ipBlock.service.serviceName,
            $scope.data.ip.ip,
            $scope.model.type,
            $scope.model.virtualMachineName,
          )
            .then(() => {
              $rootScope.$broadcast(
                'ips.table.refreshBlock',
                $scope.data.ipBlock,
              );
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
            $scope.data.ipBlock.service.serviceName,
            $scope.model.macAddress,
            $scope.data.ip.ip,
            $scope.model.virtualMachineName,
          )
            .then(() => {
              $rootScope.$broadcast(
                'ips.table.refreshBlock',
                $scope.data.ipBlock,
              );
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
    },
  );
