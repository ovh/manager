import assign from 'lodash/assign';
import every from 'lodash/every';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import set from 'lodash/set';

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeSnapshotCtrl',
    function CloudProjectComputeSnapshotCtrl(
      $uibModal,
      CucPriceHelper,
      OvhApiCloudProjectSnapshot,
      OvhApiCloudProjectInstance,
      OvhApiCloudProjectVolume,
      OvhApiCloudProjectVolumeSnapshot,
      OvhApiCloudProjectImage,
      $translate,
      CucCloudMessage,
      $scope,
      $filter,
      $q,
      $timeout,
      CloudProjectOrchestrator,
      $state,
      $stateParams,
      Poller,
      CucRegionService,
      CLOUD_UNIT_CONVERSION,
    ) {
      const self = this;
      const serviceName = $stateParams.projectId;

      let instances = [];
      let images = [];

      const orderBy = $filter('orderBy');

      self.regionService = CucRegionService;
      // Datas
      self.table = {
        snapshot: [],
        snapshotFilter: [],
        snapshotFilterCheckbox: [],
        snapshotFilterCheckboxPage: [],
        selected: {},
        autoSelected: [],
      };

      self.toggle = {
        snapshotDeleteId: null, // Curent snapshot to delete
        openDeleteMultiConfirm: false,
      };

      // Loader during Datas requests
      self.loaders = {
        table: {
          snapshot: false,
        },
        remove: {
          snapshot: false,
          snapshotMulti: false,
        },
      };

      self.order = {
        by: 'creationDate',
        reverse: true,
      };

      self.GIBIBYTE_TO_BYTE = CLOUD_UNIT_CONVERSION.GIBIBYTE_TO_BYTE;

      function initSearchBar() {
        self.search = {
          name: null,
          size: null,
          creationStart: null,
          creationEnd: null,
        };
      }

      function init() {
        self.getSnapshot(true); // set clear cache to true because we need fresh data
        initSearchBar();
      }

      self.snapshotPriceStruct = {
        prices: null,
        size: 0,
        total: {},
      };

      function getMonthlyPrice(size, planCode) {
        // get the price for first location comming
        const price = self.snapshotPriceStruct.prices[planCode];
        if (!price) {
          return { value: 0, text: '?' };
        }
        const priceStruct = angular.copy(price.price);
        // price for all size
        priceStruct.value =
          (price.priceInUcents *
            moment.duration(1, 'months').asHours() *
            size) /
          100000000;

        priceStruct.text = priceStruct.text.replace(
          /\d+(?:[.,]\d+)?/,
          `${priceStruct.value.toFixed(2)}`,
        );

        return priceStruct;
      }

      function setPrice() {
        let totalSize = 0;
        let totalPrice = 0;
        if (!self.table.snapshot.length) {
          return;
        }
        angular.forEach(self.table.snapshot, (snapshot) => {
          totalSize += snapshot.size;
          set(
            snapshot,
            'price',
            getMonthlyPrice(snapshot.size, snapshot.planCode),
          );
          if (snapshot.price) {
            totalPrice += snapshot.price.value;
          }
        });
        self.snapshotPriceStruct.size = totalSize;
        // Copy from formatted price to keep currencyCode
        self.snapshotPriceStruct.total = angular.copy(
          self.table.snapshot[0].price,
        );
        self.snapshotPriceStruct.total.value = totalPrice;
        self.snapshotPriceStruct.total.text = self.snapshotPriceStruct.total.text.replace(
          /\d+(?:[.,]\d+)?/,
          `${totalPrice.toFixed(2)}`,
        );
      }

      // ---------TOOLS---------

      self.getSelectedCount = function getSelectedCount() {
        return Object.keys(self.table.selected).length;
      };

      $scope.$watch(
        'CloudProjectComputeSnapshotCtrl.table.snapshotFilterPage',
        (pageSnapshots) => {
          self.table.snapshotFilterCheckboxPage = filter(
            pageSnapshots,
            (snapshot) =>
              (snapshot.status === 'active' ||
                snapshot.status === 'available') &&
              !snapshot.isInstalledOnVm,
          );
        },
      );

      $scope.$watch(
        'CloudProjectComputeSnapshotCtrl.table.selected',
        () => {
          // if some line were not removed => recheck
          self.toggle.openDeleteMultiConfirm = false;
          if (self.table.autoSelected.length) {
            angular.forEach(self.table.autoSelected, (snapshotId) => {
              const isInSnapshotTable = findIndex(
                self.table.snapshot,
                (snapshot) => snapshot.id === snapshotId,
              );
              if (isInSnapshotTable >= 0) {
                self.table.selected[snapshotId] = true;
              }
            });
            self.table.autoSelected = [];
          } else {
            self.toggle.openDeleteMultiConfirm = false;
          }
        },
        true,
      );

      self.toggleDeleteMultiConfirm = function toggleDeleteMultiConfirm() {
        if (self.toggle.openDeleteMultiConfirm) {
          self.table.selected = {};
        }
        self.toggle.snapshotDeleteId = null;
        self.toggle.openDeleteMultiConfirm = !self.toggle
          .openDeleteMultiConfirm;
      };

      // ---------SEARCH BAR---------

      function filterSnapshot() {
        if ($scope.searchSnapshotForm && $scope.searchSnapshotForm.$valid) {
          let tab = self.table.snapshot;
          tab = filter(self.table.snapshot, (snapshot) => {
            let result = true;

            if (self.search.name && snapshot.name) {
              const index = snapshot.name
                .toLowerCase()
                .indexOf(self.search.name.toLowerCase());
              result = result && index !== -1;
            }
            if (self.search.size) {
              result =
                result &&
                self.search.size >= Math.round(snapshot.size * 100) / 100;
            }
            if (self.search.creationStart) {
              result =
                result &&
                moment(self.search.creationStart) <=
                  moment(snapshot.creationDate);
            }
            if (self.search.creationEnd) {
              result =
                result &&
                moment(self.search.creationEnd) > moment(snapshot.creationDate);
            }

            return result;
          });

          self.table.snapshotFilter = tab;
          self.table.snapshotFilterCheckbox = filter(
            tab,
            (snapshot) =>
              (snapshot.status === 'active' ||
                snapshot.status === 'available') &&
              !snapshot.isInstalledOnVm,
          );

          if (self.table.snapshotFilter.length) {
            self.orderBy();
          }
        }
      }

      $scope.$watch(
        'CloudProjectComputeSnapshotCtrl.search',
        () => {
          // otherwise filterSnapshot launched before form validation
          $timeout(() => {
            filterSnapshot();
          }, 0);
        },
        true,
      );

      // ---------ORDER---------

      self.orderBy = function orderByFn(by) {
        if (by) {
          if (self.order.by === by) {
            self.order.reverse = !self.order.reverse;
          } else {
            self.order.by = by;
          }
        }
        self.table.snapshotFilter = orderBy(
          self.table.snapshotFilter,
          self.order.by,
          self.order.reverse,
        );
        self.table.snapshotFilterCheckbox = orderBy(
          self.table.snapshotFilterCheckbox,
          self.order.by,
          self.order.reverse,
        );
      };

      function snapshotStateChange(oldSnapshots, newSnapshots) {
        let stateChanged = false;
        forEach(newSnapshots, (snapshot) => {
          const old = find(oldSnapshots, { id: snapshot.id });
          stateChanged = stateChanged || !old || old.status !== snapshot.status;
        });
        return stateChanged;
      }

      // transform snapshot type > snapshot is an image custom if this present in image as private
      function checkImagesCustom(snapshots) {
        return map(snapshots, (snapshot) =>
          assign(snapshot, {
            type:
              (find(images, { id: snapshot.id, visibility: 'private' })
                ? 'image'
                : '') + snapshot.type,
          }),
        );
      }

      function checkImageInstalled() {
        angular.forEach(self.table.snapshot, (snapshot) => {
          set(
            snapshot,
            'isInstalledOnVm',
            !!find(instances, { imageId: snapshot.id }),
          );
          set(
            snapshot,
            'installedVm',
            filter(instances, { imageId: snapshot.id }),
          );
          set(snapshot, 'installedVmNames', map(snapshot.installedVm, 'name'));
        });
      }

      function pollSnapshots() {
        Poller.poll(`/cloud/project/${serviceName}/snapshot`, null, {
          successRule(snapshots) {
            return every(snapshots, (snapshot) => snapshot.status === 'active');
          },
          namespace: 'cloud.snapshots',
          notifyOnError: false,
        }).then(
          (snapshotList) => {
            OvhApiCloudProjectSnapshot.v6().resetQueryCache();
            // get volume snapshots and concat new state instance snapshots
            const volumeSnapshots = filter(self.table.snapshot, {
              type: 'volume',
            });
            self.table.snapshot = snapshotList.concat(volumeSnapshots);
            checkImageInstalled();
            filterSnapshot(); // orderBy is call by filterSnapshot();
            setPrice();
          },
          (err) => {
            if (err && err.status) {
              self.table.snapshot = filter(self.table.snapshot, {
                type: 'volume',
              });
              CucCloudMessage.error(
                [
                  $translate.instant('cpc_snapshot_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
            }
          },
          (snapshotList) => {
            const currentImageSnapshots = filter(
              self.table.snapshot,
              (snapshot) => snapshot.type !== 'volume',
            );
            if (
              currentImageSnapshots.length !== snapshotList.length ||
              snapshotStateChange(self.table.snapshot, snapshotList)
            ) {
              OvhApiCloudProjectSnapshot.v6().resetQueryCache();
              const volumeSnapshots = filter(self.table.snapshot, {
                type: 'volume',
              });
              self.table.snapshot = snapshotList.concat(volumeSnapshots);
              checkImageInstalled();
              filterSnapshot(); // orderBy is call by filterSnapshot();
              setPrice();
            }
          },
        );
      }

      function mapVolumeSnapshots(snapshots) {
        return map(snapshots, (volumeSnapshot) =>
          assign(volumeSnapshot, {
            visibility: 'private',
            size: volumeSnapshot.size,
            type: 'volume',
          }),
        );
      }

      function pollVolumeSnapshots() {
        Poller.poll(`/cloud/project/${serviceName}/volume/snapshot`, null, {
          successRule(snapshots) {
            return every(
              snapshots,
              (snapshot) => snapshot.status === 'available',
            );
          },
          namespace: 'cloud.snapshots',
          notifyOnError: false,
        }).then(
          (snapshotList) => {
            OvhApiCloudProjectVolumeSnapshot.v6().resetAllCache();
            // get instance snapshots and concat new state volume snapshots
            const imageSnapshots = filter(
              self.table.snapshot,
              (snapshot) => snapshot.type !== 'volume',
            );
            const snapshots = checkImagesCustom(snapshotList);
            self.table.snapshot = imageSnapshots.concat(
              mapVolumeSnapshots(snapshots),
            );
            filterSnapshot(); // orderBy is call by filterSnapshot();
            setPrice();
          },
          (err) => {
            if (err && err.status) {
              self.table.snapshot = filter(
                self.table.snapshot,
                (snapshot) => snapshot.type !== 'volume',
              );
              CucCloudMessage.error(
                [
                  $translate.instant('cpc_snapshot_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
            }
          },
          (snapshotList) => {
            const currentVolumeSnapshots = filter(self.table.snapshot, {
              type: 'volume',
            });
            if (
              currentVolumeSnapshots.length !== snapshotList.length ||
              snapshotStateChange(self.table.snapshot, snapshotList)
            ) {
              OvhApiCloudProjectVolumeSnapshot.v6().resetAllCache();
              const imageSnapshots = filter(
                self.table.snapshot,
                (snapshot) => snapshot.type !== 'volume',
              );
              const snapshots = checkImagesCustom(snapshotList);
              self.table.snapshot = imageSnapshots.concat(
                mapVolumeSnapshots(snapshots),
              );
              filterSnapshot(); // orderBy is call by filterSnapshot();
              setPrice();
            }
          },
        );
      }

      $scope.$on('$destroy', () => {
        Poller.kill({ namespace: 'cloud.snapshots' });
      });

      // ---------SNAPSHOT---------

      function getInstancePromise() {
        return OvhApiCloudProjectInstance.v6().query({
          serviceName,
        }).$promise;
      }

      function getSnapshotPromise() {
        return OvhApiCloudProjectSnapshot.v6().query({
          serviceName,
        }).$promise;
      }

      function getImagePromise() {
        return OvhApiCloudProjectImage.v6().query({
          serviceName,
        }).$promise;
      }

      function getPricesPromise() {
        return CucPriceHelper.getPrices(serviceName);
      }

      function getVolumeSnapshotPromise() {
        return OvhApiCloudProjectVolumeSnapshot.v6()
          .query({
            serviceName,
          })
          .$promise.then((result) => mapVolumeSnapshots(result)); // transform
      }

      self.getSnapshot = function getSnapshot(clearCache) {
        if (!self.loaders.table.snapshot) {
          self.table.snapshot = [];
          self.toggle.snapshotDeleteId = null;
          self.loaders.table.snapshot = true;
          if (clearCache) {
            OvhApiCloudProjectSnapshot.v6().resetQueryCache();
            OvhApiCloudProjectInstance.v6().resetQueryCache();
            // because with check if snapshot is installed on instances
            OvhApiCloudProjectVolume.v6().resetAllCache();
          }

          $q.all([
            getInstancePromise(),
            getSnapshotPromise(),
            getPricesPromise(),
            getVolumeSnapshotPromise(),
            getImagePromise(),
          ])
            .then(
              ([instancesParam, snapShots, prices, volumes, imagesParam]) => {
                instances = instancesParam;
                images = imagesParam;

                const snapshots = checkImagesCustom(snapShots);
                self.table.snapshot = snapshots.concat(volumes);
                checkImageInstalled();
                filterSnapshot(); // orderBy is call by filterSnapshot();
                const instanceSnapshotsToPoll = filter(
                  self.table.snapshot,
                  (snapshot) =>
                    snapshot.type !== 'volume' && snapshot.status !== 'active',
                );

                const volumeSnapshotsToPoll = filter(
                  self.table.snapshot,
                  (snapshot) =>
                    snapshot.type === 'volume' &&
                    snapshot.status !== 'available',
                );
                if (instanceSnapshotsToPoll) {
                  pollSnapshots();
                }
                if (volumeSnapshotsToPoll) {
                  pollVolumeSnapshots();
                }
                self.snapshotPriceStruct.prices = prices;
                setPrice();
              },
              (err) => {
                self.table.snapshot = null;
                CucCloudMessage.error(
                  [
                    $translate.instant('cpc_snapshot_error'),
                    (err.data && err.data.message) || '',
                  ].join(' '),
                );
              },
            )
            .finally(() => {
              self.loaders.table.snapshot = false;
            });
        }
      };

      self.createVmBySnapshot = function createVmBySnapshot(snapshot) {
        CucCloudMessage.info(
          $translate.instant('cpc_snapshot_create_vm_button_info'),
        );
        CloudProjectOrchestrator.askToCreateInstanceFromSnapshot(snapshot);
        $state.go('iaas.pci-project.compute.infrastructure.diagram');
      };

      self.createVolumeBySnapshot = function createVolumeBySnapshot(snapshot) {
        CucCloudMessage.info(
          $translate.instant('cpc_snapshot_create_volume_button_info'),
        );
        $timeout(() => {
          $state.go('iaas.pci-project.compute.infrastructure.diagram', {
            createNewVolumeFromSnapshot: {
              snapshot,
            },
          });
        }, 99);
      };

      self.openDeleteSnapshot = function openDeleteSnapshot(snapshot) {
        $uibModal.open({
          windowTopClass: 'cui-modal',
          templateUrl:
            'app/cloud/project/compute/snapshot/delete/compute-snapshot-delete.html',
          controller: 'CloudProjectComputeSnapshotDeleteCtrl',
          controllerAs: 'CloudProjectComputeSnapshotDeleteCtrl',
          resolve: {
            serviceName: () => serviceName,
            snapshot: () => snapshot,
          },
          successHandler: () => {
            self.getSnapshot(true);
            CucCloudMessage.success(
              $translate.instant('cpc_snapshot_delete_success'),
            );
            pollSnapshots();
            pollVolumeSnapshots();
          },
          errorHandler: (err) =>
            CucCloudMessage.error(
              [
                $translate.instant('cpc_snapshot_delete_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            ),
        });
      };

      init();
    },
  );
