import set from 'lodash/set';

angular.module('Module.ip.controllers').controller('IplbDashboardCtrl', [
  '$location',
  '$q',
  '$rootScope',
  '$scope',
  '$translate',
  'Alerter',
  'Iplb',
  'User',
  ($location, $q, $rootScope, $scope, $translate, Alerter, Iplb, User) => {
    $scope.loading = {};

    // ---

    function init() {
      $scope.loading.init = true;
      $scope.ipsList = [];
      $scope.iplbOrderUrl = '';

      return Iplb.getList().then((list) => {
        $scope.iplbList = list;
        if (list && list.length) {
          if (
            $location.search().serviceName &&
            ~list.indexOf($location.search().serviceName)
          ) {
            $scope.selectIplb($location.search().serviceName);
          } else {
            $scope.selectIplb(
              $rootScope.preselectedIplb
                ? $scope.preselectedIplb.value
                : list[0],
            );
          }
          set($rootScope, 'preselectedIplb', $scope.selectedIplb);
        } else {
          User.getUrlOf('iplbOrder').then((orderUrl) => {
            $scope.iplbOrderUrl = orderUrl;
          });
        }
        $scope.loading.init = false;
      });
    }

    function loadBackends() {
      /* null is needed to force a full reload because if the list of ids is the
       * same, the infos of backends is not reloaded */
      $scope.selectedIplb.backendIds = null;
      Iplb.getBackends($scope.selectedIplb.value).then((backends) => {
        $scope.selectedIplb.backendIds = backends;
        Iplb.getTasksToPoll($scope.selectedIplb.value);
      });
    }

    function loadPortsRedirections() {
      Iplb.getPortsRedirections($scope.selectedIplb.value).then(
        (portsRedirectionIds) => {
          $scope.selectedIplb.portsRedirectionIds = portsRedirectionIds;
        },
      );
    }

    $scope.selectIplb = function selectIplb(iplb) {
      $scope.selectedIplb = {
        value: iplb,
        polling: {},
        zone: {},
        isExpired: false,
      };
      $scope.loading.infos = true;

      $location.search('serviceName', $scope.selectedIplb.value);

      return Iplb.getServiceInfos($scope.selectedIplb.value)
        .then(
          (serviceInfos) => {
            $scope.selectedIplb.expiration = serviceInfos.expiration;
            if (serviceInfos.status === 'expired') {
              $scope.selectedIplb.isExpired = true;
            } else {
              return Iplb.getDetails($scope.selectedIplb.value).then(
                (data) => {
                  $scope.selectedIplb.infos = data;
                  Iplb.killAllPolling();
                  if (data && data.zone && data.zone.length) {
                    $scope.selectTabZone(data.zone[0]);
                  }
                  loadBackends();
                  loadPortsRedirections();
                },
                (data) => {
                  Alerter.alertFromSWS(
                    $translate.instant('iplb_infos_error'),
                    data,
                  );
                },
              );
            }
            return null;
          },
          (data) => {
            Alerter.alertFromSWS($translate.instant('iplb_infos_error'), data);
          },
        )
        .finally(() => {
          $scope.loading.infos = false;
        });
    };

    // --- Zones (pop)

    $scope.selectTabZone = function selectTabZone(value) {
      $scope.selectedIplb.zone.selected = value;
      $scope.selectedIplb.zone.internalNatIp = null;
      $scope.selectedIplb.zone.probeIp = null;

      $scope.loading.zone = true;
      const queue = [];
      queue.push(
        Iplb.getInternalNatIp(
          $scope.selectedIplb.value,
          $scope.selectedIplb.zone.selected,
        ).then((internalNatIp) => {
          $scope.selectedIplb.zone.internalNatIp = internalNatIp;
        }),
      );
      queue.push(
        Iplb.getProbeIp(
          $scope.selectedIplb.value,
          $scope.selectedIplb.zone.selected,
        ).then((probeIp) => {
          $scope.selectedIplb.zone.probeIp = probeIp.join(', ');
        }),
      );
      return $q.all(queue).finally(() => {
        $scope.loading.zone = false;
      });
    };

    // --- Backends

    $scope.transformItemBackend = function transformItemBackend(item) {
      $scope.loading.backends = true;
      return Iplb.getBackend($scope.selectedIplb.value, item);
    };
    $scope.onTransformItemBackendDone = function onTransformItemBackendDone() {
      $scope.loading.backends = false;
    };

    // --- Ports redirection

    $scope.transformItemPortsRedirection = function transformItemPortsRedirection(
      item,
    ) {
      $scope.loading.ports = true;
      return Iplb.getPortsRedirection($scope.selectedIplb.value, item);
    };
    $scope.onTransformItemPortsRedirectionDone = function onTransformItemPortsRedirectionDone() {
      $scope.loading.ports = false;
    };

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    // --- Polling

    // Stickiness
    $scope.$on('iplb.setStickiness.start', () => {
      $scope.selectedIplb.polling.stickiness = true;
    });
    $scope.$on('iplb.setStickiness.done', (e, infos) => {
      $scope.selectedIplb.infos = infos;
      $scope.selectedIplb.polling.stickiness = false;
    });
    $scope.$on('iplb.setStickiness.error', () => {
      $scope.selectedIplb.polling.stickiness = false;
    });

    // Activate SSL
    $scope.$on('iplb.activateSsl.start', () => {
      $scope.selectedIplb.polling.activateSsl = true;
    });
    $scope.$on('iplb.activateSsl.done', (e, infos) => {
      $scope.selectedIplb.infos = infos;
      $scope.selectedIplb.polling.activateSsl = false;
    });
    $scope.$on('iplb.activateSsl.error', () => {
      $scope.selectedIplb.polling.activateSsl = false;
    });

    // Desactivate SSL
    $scope.$on('iplb.desactivateSsl.start', () => {
      $scope.selectedIplb.polling.desactivateSsl = true;
    });
    $scope.$on('iplb.desactivateSsl.done', (e, infos) => {
      $scope.selectedIplb.infos = infos;
      $scope.selectedIplb.polling.desactivateSsl = false;
    });
    $scope.$on('iplb.desactivateSsl.error', () => {
      $scope.selectedIplb.polling.desactivateSsl = false;
    });

    $scope.$on('$destroy', () => {
      Iplb.killAllPolling();
      $location.search('tab', null);
      $location.search('serviceName', null);
      $scope.backendTaskDoing = false;
    });

    $scope.$on('iplb.backends.needUpdate', () => {
      loadBackends();
      $scope.backendTaskDoing = false;
    });

    $scope.$on('iplb.ports.needUpdate', () => {
      loadPortsRedirections();
    });

    $scope.$on('iplb.addBackend.start', (event, backend) => {
      $scope.backendTaskDoing = true;
      let message = '';
      if (backend.serviceName) {
        message += ['[', backend.serviceName, '] '].join('');
      }

      message += $translate.instant('iplb_backend_add_success');
      Alerter.success(message, 'polling_action');
    });
    $scope.$on('iplb.backends.error', () => {
      $scope.backendTaskDoing = false;
    });
    $scope.$on('iplb.delBackend.start', (event, backend) => {
      $scope.backendTaskDoing = true;
      let message = '';
      if (backend.serviceName) {
        message += ['[', backend.serviceName, '] '].join('');
      }

      message += $translate.instant('iplb_backend_delete_success');
      Alerter.success(message, 'polling_action');
    });
    $scope.$on('iplb.backupStateSet.start', (event, backend) => {
      $scope.backendTaskDoing = true;
      let message = '';
      if (backend.serviceName) {
        message += ['[', backend.serviceName, '] '].join('');
      }

      message += $translate.instant('iplb_backend_setbackupstate_success');
      Alerter.success(message, 'polling_action');
    });
    $scope.$on('iplb.backupStateUnset.start', (event, backend) => {
      $scope.backendTaskDoing = true;
      let message = '';
      if (backend.serviceName) {
        message += ['[', backend.serviceName, '] '].join('');
      }

      message += $translate.instant('iplb_backend_unsetbackupstate_success');
      Alerter.success(message, 'polling_action');
    });
    $scope.$on('iplb.setWeight.start', (event, backend) => {
      $scope.backendTaskDoing = true;
      let message = '';
      if (backend.serviceName) {
        message += ['[', backend.serviceName, '] '].join('');
      }

      message += $translate.instant('iplb_backend_setweight_success');
      Alerter.success(message, 'polling_action');
    });

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    init();
  },
]);
