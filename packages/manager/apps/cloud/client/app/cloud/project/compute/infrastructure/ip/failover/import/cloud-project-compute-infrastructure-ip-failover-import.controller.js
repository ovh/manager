import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureIpFailoverImportCtrl',
    function CloudProjectComputeInfrastructureIpFailoverImportCtrl(
      $scope,
      $uibModalInstance,
      OvhApiIp,
      $translate,
      CucCloudMessage,
      OvhApiCloudProjectInstance,
      $stateParams,
      $q,
      OvhApiMe,
      CLOUD_GEOLOCALISATION,
      pendingImportIps,
    ) {
      const self = this;

      $scope.projectId = $stateParams.projectId;

      self.datas = {
        autoSelected: [],
        ipsFo: [],
        ipsFoDetail: [],
        ipsFoDetailIds: [],
        vms: [],
        user: null,

        selected: {},
        selectedvm: null,
      };

      self.loaders = {
        table: {
          ipsFo: false,
          importIpsFo: false,
        },
        vms: false,
      };

      // ---------INIT---------

      function getIpsFo(clearCache) {
        if (!self.loaders.table.ipsFo) {
          self.loaders.table.ipsFo = true;
          if (clearCache) {
            OvhApiIp.v6().resetQueryCache();
            OvhApiIp.v6().resetCache();
          }
          return OvhApiIp.v6()
            .query({
              type: 'failover',
            })
            .$promise.then(
              (ipsParams) => {
                const ips = filter(
                  ipsParams,
                  (ip) => indexOf(pendingImportIps, ip) < 0,
                );
                return self.initIps(ips);
              },
              (err) => {
                CucCloudMessage.error(
                  [
                    $translate.instant('cpciif_import_ips_error'),
                    (err.data && err.data.message) || '',
                  ].join(' '),
                );
                self.datas.ipsFo = null;
              },
            )
            .finally(() => {
              self.loaders.table.ipsFo = false;
            });
        }
        return $q.when();
      }

      function init() {
        return OvhApiMe.v6()
          .get()
          .$promise.then(
            (user) => {
              self.datas.user = user;
              return getIpsFo(true);
            },
            (err) => {
              CucCloudMessage.error(
                [
                  $translate.instant('cpciif_import_ips_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
            },
          );
      }

      /**
       * Fetch informations for every IPFO (we need to check if ipfo is already linked
       * to current project and if his region is compatible)
       */
      self.initIps = function initIps(ips) {
        const queries = [];
        self.datas.ipsFo = [];

        angular.forEach(ips, (ip) => {
          queries.push(
            OvhApiIp.v6()
              .get({
                ip,
              })
              .$promise.then((ipParam) => {
                if (
                  !(
                    ipParam.routedTo &&
                    ipParam.routedTo.serviceName === $scope.projectId
                  )
                ) {
                  self.datas.ipsFo.push(ipParam);
                }
              }),
          );
        });

        return $q.all(queries);
      };

      // ---------TOOLS---------

      $scope.$watch(
        'CPCIIpFailoverImportCtrl.datas.selected',
        () => {
          // if some line were not move => recheck
          if (self.datas.autoSelected.length) {
            angular.forEach(self.datas.autoSelected, (ip) => {
              self.datas.selected[ip] = true;
            });
            self.datas.autoSelected = [];
          }
        },
        true,
      );

      self.refreshIpsFo = function refreshIpsFo() {
        getIpsFo(true);
      };

      self.getSelectedCount = function getSelectedCount() {
        return Object.keys(self.datas.selected).length;
      };

      self.getInfoSelect = function getInfoSelect() {
        if (Object.keys(self.datas.selected).length === 1) {
          return Object.keys(self.datas.selected)[0];
        }
        if (Object.keys(self.datas.selected).length > 1) {
          return Object.keys(self.datas.selected).length;
        }
        return null;
      };

      // ---------MODAL---------

      self.confirm = function confirm() {
        if (!self.loaders.table.importIpsFo) {
          const listPromise = [];

          const listIpsWithTasks = [];

          const nbSelected = self.getSelectedCount();

          let lastIp = '';

          self.loaders.table.importIpsFo = true;

          angular.forEach(self.datas.selected, (value, ip) => {
            lastIp = ip;

            listPromise.push(
              OvhApiIp.v6()
                .move({ ip }, { to: $scope.projectId })
                .$promise.then(
                  (task) => {
                    listIpsWithTasks.push({
                      // à revoir
                      ip,
                      task,
                    });
                  },
                  (error) =>
                    $q.reject({
                      ip,
                      error,
                    }),
                ),
            );
          });

          $q.allSettled(listPromise)
            .then(
              () => {
                if (nbSelected > 1) {
                  CucCloudMessage.success(
                    $translate.instant(
                      'cpciif_import_vms_route_of_success_plural',
                      { nbIps: nbSelected },
                    ),
                  );
                } else {
                  CucCloudMessage.success(
                    $translate.instant('cpciif_import_vms_route_of_success', {
                      ip: lastIp,
                    }),
                  );
                }
                $uibModalInstance.close(listIpsWithTasks);
              },
              (error) => {
                const tabError = error.filter((val) => !!val.error);

                const ipError = map(tabError, 'ip');

                self.datas.autoSelected = angular.copy(ipError);

                if (tabError.length > 1) {
                  CucCloudMessage.error(
                    $translate.instant(
                      'cpciif_import_vms_route_of_error_plural',
                      { ips: ipError.toString() },
                    ),
                  );
                } else {
                  const errorIp = tabError[0].error;
                  CucCloudMessage.error(
                    [
                      $translate.instant('cpciif_import_vms_route_of_error', {
                        ip: tabError[0].ip,
                      }),
                      (errorIp.data && errorIp.data.message) || '',
                    ].join(' '),
                  );
                }
              },
            )
            .finally(() => {
              self.datas.selected = {};

              self.loaders.table.importIpsFo = false;
            });
        }
      };

      self.cancel = function cancel() {
        $uibModalInstance.dismiss();
      };

      init();
    },
  );
