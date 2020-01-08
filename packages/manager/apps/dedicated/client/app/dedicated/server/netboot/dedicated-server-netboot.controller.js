import debounce from 'lodash/debounce';

angular
  .module('controllers')
  .controller(
    'controllers.Server.Netboot',
    ($scope, Server, Alerter, $q, $stateParams, $translate) => {
      const regRootDevice1 = new RegExp('^/dev/[hs]d[ab][0-9]+$');
      const regRootDevice2 = new RegExp('^/dev/md[0-9]+$');
      const regRootDevice3 = new RegExp('^/dev/rd/c0p0[0-9]+$');
      const regRootDevice4 = new RegExp('^/dev/ram0$');
      const alertId = 'server_dashboard_alert';

      $scope.HARDDISK = 'harddisk';
      $scope.RESCUE = 'rescue';
      $scope.NETWORK = 'network';

      $scope.loading = {
        init: true,
        setNetboot: false,
      };
      $scope.isValid = {
        root: null,
        rescueMail: null,
      };

      $scope.netboots = null; // all available netboot
      $scope.networkNetboot = null; // network available netboot
      $scope.currentNetboot = {}; // current netboot option
      $scope.rootDevice = {
        root: null,
      };

      $scope.getCurrent = function getCurrent() {
        angular.forEach($scope.netboots, (eachNetboot, netbootType) => {
          $scope.currentNetboot[netbootType] = '';

          if (netbootType === $scope.NETWORK) {
            $scope.networkNetboot = eachNetboot;
          } else if (netbootType === $scope.HARDDISK) {
            $scope.currentNetboot.harddisk = {
              // because harddisk hasn't option
              id: eachNetboot[0].id,
            };
          }

          angular.forEach(eachNetboot, (eachNetbootItem) => {
            if (eachNetbootItem.id === $scope.server.bootId) {
              $scope.currentNetboot.type = eachNetbootItem.type.toLowerCase();
              $scope.currentNetboot[netbootType] = eachNetbootItem;
            }
          });
        });

        if ($scope.server.rootDevice) {
          $scope.rootDevice.root = $scope.server.rootDevice;
        }
      };

      $scope.firstStepValidation = function firstStepValidation() {
        return (
          $scope.currentNetboot.type === $scope.HARDDISK ||
          ($scope.currentNetboot.type === $scope.RESCUE &&
            $scope.currentNetboot.rescue !== '' &&
            $scope.isValid.rescueMail) ||
          ($scope.currentNetboot.type === $scope.NETWORK &&
            $scope.currentNetboot.network !== '' &&
            $scope.isValid.root)
        );
      };

      function rootDeviceValidation() {
        return (
          regRootDevice1.test($scope.rootDevice.root) ||
          regRootDevice2.test($scope.rootDevice.root) ||
          regRootDevice3.test($scope.rootDevice.root) ||
          regRootDevice4.test($scope.rootDevice.root)
        );
      }

      $scope.getActiveOptions = function getActiveOptions(networkOption) {
        return networkOption.value !== 'N';
      };

      $scope.$watch(
        'rootDevice.root',
        debounce((root) => {
          $scope.$apply(() => {
            if (root !== null) {
              $scope.isValid.root = rootDeviceValidation();
            }
          });
        }, 300),
      );

      $scope.$watch(
        'currentNetboot.rescueMail',
        debounce((rescueMail) => {
          $scope.$apply(() => {
            $scope.isValid.rescueMail = false;
            if (
              rescueMail === null ||
              rescueMail !== undefined ||
              rescueMail === ''
            ) {
              $scope.isValid.rescueMail = true;
            }
          });
        }, 300),
      );

      $scope.setNetboot = function setNetboot() {
        const netbootId = $scope.currentNetboot[$scope.currentNetboot.type].id;
        const rootDevice =
          ($scope.currentNetboot.type === $scope.NETWORK &&
            $scope.rootDevice.root) ||
          $scope.server.rootDevice;
        const netbootType = $scope.currentNetboot.type;

        $scope.loading.setNetboot = true;

        const promiseList = [
          Server.setNetBoot(
            $stateParams.productId,
            netbootId,
            rootDevice,
            netbootType,
          ),
        ];
        if ($scope.currentNetboot.type === $scope.RESCUE) {
          promiseList.push(
            Server.updateRescueMail(
              $stateParams.productId,
              netbootId,
              $scope.currentNetboot.rescueMail,
            ),
          );
        }

        $q.all(promiseList)
          .then(
            () => {
              Alerter.success(
                $translate.instant('server_configuration_netboot_success'),
                alertId,
              );
            },
            (data) => {
              Alerter.alertFromSWS(
                $translate.instant('server_configuration_netboot_fail', {
                  t0: $scope.server.name,
                }),
                data.data,
              );
            },
          )
          .finally(() => {
            $scope.resetAction();
          });
      };

      function loadRescueMail() {
        Server.getRescueMail($stateParams.productId).then(
          (server) => {
            $scope.currentNetboot.rescueMail = server.rescueMail;
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant('server_configuration_netboot_loading_error', {
                t0: $scope.server.name,
              }),
              data.data,
            );
          },
        );
      }

      $scope.loadNetboots = function loadNetboots() {
        $scope.loading.init = true;
        Server.getNetboot($stateParams.productId)
          .then(
            (netboots) => {
              $scope.netboots = netboots;
              if ($scope.netboots.ipxeCustomerScript) {
                delete $scope.netboots.ipxeCustomerScript;
              }

              $scope.getCurrent();
              loadRescueMail();
            },
            (data) => {
              $scope.resetAction();
              Alerter.alertFromSWS(
                $translate.instant(
                  'server_configuration_netboot_loading_error',
                  { t0: $scope.server.name },
                ),
                data.data,
              );
            },
          )
          .finally(() => {
            $scope.loading.init = false;
          });
      };
    },
  );
