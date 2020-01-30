import filter from 'lodash/filter';
import find from 'lodash/find';
import set from 'lodash/set';

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeVolumeCtrl',
    function CloudProjectComputeVolumeCtrl(
      $scope,
      $filter,
      $q,
      $timeout,
      $stateParams,
      $translate,
      $state,
      CucControllerHelper,
      CloudProjectOrchestrator,
      OvhApiCloudProjectVolume,
      OvhApiCloudProjectVolumeSnapshot,
      OvhApiCloudProjectInstance,
      CucCloudMessage,
      CucRegionService,
      CLOUD_UNIT_CONVERSION,
    ) {
      const self = this;

      const serviceName = $stateParams.projectId;

      const orderBy = $filter('orderBy');
      self.regionService = CucRegionService;
      // Datas
      self.table = {
        volume: [],
        volumeFilter: [],
        groupVolume: {},
        selected: {},
        autoSelected: [],
        instance: [],
        volumeFilterCheckbox: [],
        volumeFilterCheckboxPage: [],
      };

      self.toggle = {
        volumeDeleteId: null, // Curent volume to delete
        openDeleteMultiConfirm: false,
      };

      // Loader during Datas requests
      self.loaders = {
        table: {
          volume: false,
        },
        remove: {
          volume: false,
          volumeMulti: false,
        },
      };

      self.order = {
        by: 'creationDate',
        reverse: true,
      };

      self.totalResume = {
        capacity: 0,
        price: {
          value: 0,
          text: null,
          currencyCode: null,
        },
      };

      self.GIBIBYTE_TO_BYTE = CLOUD_UNIT_CONVERSION.GIBIBYTE_TO_BYTE;

      function initSearchBar() {
        self.search = {
          name: null,
          minDisk: null,
          creationStart: null,
          creationEnd: null,
        };
      }

      function init() {
        self.getVolume();
        initSearchBar();
      }

      // ---------TOOLS---------

      self.getSelectedCount = function getSelectedCount() {
        return Object.keys(self.table.selected).length;
      };

      $scope.$watch(
        'CloudProjectComputeVolumeCtrl.table.selected',
        () => {
          // if some line were not removed => recheck
          self.toggle.openDeleteMultiConfirm = false;
          if (self.table.autoSelected.length) {
            angular.forEach(Object.keys(self.table.selected), (volumeId) => {
              if (self.table.selected[volumeId] === false) {
                delete self.table.selected[volumeId];
              } else {
                const isInVolumeTable = find(
                  self.table.volume,
                  (volume) =>
                    volume.id === volumeId && volume.status === 'active',
                );
                if (isInVolumeTable && self.table.selected[volumeId]) {
                  self.table.selected[volumeId] = true;
                }
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
        self.toggle.volumeDeleteId = null;
        self.toggle.openDeleteMultiConfirm = !self.toggle
          .openDeleteMultiConfirm;
      };

      $scope.$watch(
        'CloudProjectComputeVolumeCtrl.table.volumeFilterPage',
        (pageVolumes) => {
          self.table.volumeFilterCheckboxPage = filter(
            pageVolumes,
            (volume) =>
              volume.getStatusGroup() === 'ACTIVE' && !volume.snapshotted,
          );
        },
      );

      // ---------SEARCH BAR---------

      function filterVolume() {
        if ($scope.searchVolumeForm && $scope.searchVolumeForm.$valid) {
          let tab = self.table.volume;
          tab = filter(self.table.volume, (volume) => {
            let result = true;

            if (self.search.name && volume.name) {
              const index = volume.name
                .toLowerCase()
                .indexOf(self.search.name.toLowerCase());
              result = result && index !== -1;
            }
            if (self.search.minDisk) {
              result = result && self.search.minDisk <= volume.size;
            }
            if (self.search.creationStart) {
              result =
                result &&
                moment(self.search.creationStart) <=
                  moment(volume.creationDate);
            }
            if (self.search.creationEnd) {
              result =
                result &&
                moment(self.search.creationEnd) > moment(volume.creationDate);
            }

            return result;
          });

          self.table.volumeFilter = tab;
          self.table.volumeFilterCheckbox = filter(
            tab,
            (volume) =>
              volume.getStatusGroup() === 'ACTIVE' && !volume.snapshotted,
          );

          if (self.table.volumeFilter.length) {
            self.orderBy();
          }
        }
      }

      $scope.$watch(
        'CloudProjectComputeVolumeCtrl.search',
        () => {
          // otherwise filterVolume launched before form validation
          $timeout(() => {
            filterVolume();
          }, 0);
        },
        true,
      );

      // ---------ORDER---------

      self.orderBy = function order(by) {
        if (by) {
          if (self.order.by === by) {
            self.order.reverse = !self.order.reverse;
          } else {
            self.order.by = by;
          }
        }
        const orderByExpression =
          self.order.by !== 'price'
            ? self.order.by
            : function orderByFn(volume) {
                return volume.calculatePrice().monthlyPrice.value;
              };

        self.table.volumeFilter = orderBy(
          self.table.volumeFilter,
          orderByExpression,
          self.order.reverse,
        );
        self.table.volumeFilterCheckbox = filter(
          self.table.volumeFilter,
          (volume) =>
            volume.getStatusGroup() === 'ACTIVE' && !volume.snapshotted,
        );
      };

      // ---------VOLUME---------

      function getVolumeListDetailed(volumeList) {
        const tab = [];
        angular.forEach(volumeList.volumes, (vols) => {
          angular.forEach(vols, (vol) => {
            tab.push(vol);
          });
        });
        return tab;
      }

      function setDetails() {
        const fullInfosQueue = [];
        let tmpInstanceDetail;
        let firstVolumePrice;
        angular.forEach(self.table.volume, (volume) => {
          fullInfosQueue.push(volume.getFullInformations());
        });

        return $q.all(fullInfosQueue).then(() => {
          // reset total resume
          self.totalResume.capacity = 0;
          self.totalResume.price.value = 0;
          self.totalResume.price.text = 0;
          self.totalResume.price.currencyCode = 0;

          angular.forEach(self.table.volume, (volume) => {
            set(volume, 'attachedToDetails', []);
            // calculate total capacity
            self.totalResume.capacity += volume.size;
            // calculate total price value
            self.totalResume.price.value += volume.calculatePrice().monthlyPrice.value;

            angular.forEach(volume.attachedTo, (instanceId) => {
              tmpInstanceDetail = find(self.table.instance, { id: instanceId });
              if (tmpInstanceDetail) {
                volume.attachedToDetails.push(tmpInstanceDetail.name);
              }
            });

            // check if the volume is linked to one or more snapshots
            set(
              volume,
              'snapshotted',
              !!find(self.table.snapshots, { volumeId: volume.id }),
            );
          });

          if (self.table.volume.length) {
            firstVolumePrice = self.table.volume[0].calculatePrice();
            // set good total price
            self.totalResume.price.text = firstVolumePrice.monthlyPrice.text.replace(
              /\d+(?:[.,]\d+)?/,
              `${self.totalResume.price.value.toFixed(2)}`,
            );
            self.totalResume.price.currencyCode =
              firstVolumePrice.monthlyPrice.currencyCode;
          }
        });
      }

      self.getVolume = function getVolume(clearCache) {
        if (!self.loaders.table.volume) {
          self.table.volume = [];
          self.table.instance = [];
          self.toggle.volumeDeleteId = null;
          self.loaders.table.volume = true;
          if (clearCache) {
            OvhApiCloudProjectVolume.v6().resetQueryCache();
          }

          $q.all([
            // GET INSTANCES DETAILS
            OvhApiCloudProjectInstance.v6()
              .query({
                serviceName,
              })
              .$promise.then((instanceList) => {
                self.table.instance = instanceList;
              }),
            // GET VOLUMES DETAILS
            CloudProjectOrchestrator.initVolumes({
              serviceName,
            }).then((volumeList) => {
              self.table.volume = getVolumeListDetailed(volumeList);
              self.table.groupVolume = volumeList;
            }),
            OvhApiCloudProjectVolumeSnapshot.v6()
              .query({
                serviceName,
              })
              .$promise.then((snapshotList) => {
                self.table.snapshots = snapshotList;
              }),
          ])
            .then(
              () =>
                setDetails().then(() => {
                  filterVolume(); // orderBy is call by filterVolume();
                }),
              (err) => {
                self.table.volume = null;
                self.table.instance = null;
                self.table.snapshots = null;
                CucCloudMessage.error(
                  [
                    $translate.instant('cpc_volume_error'),
                    (err.data && err.data.message) || '',
                  ].join(' '),
                );
              },
            )
            .finally(() => {
              self.loaders.table.volume = false;
            });
        }
      };

      // need to watch grouped volume by instance change
      // because volume tabs use an array of volume and not object...
      $scope.$watch(
        'CloudProjectComputeVolumeCtrl.table.groupVolume',
        (newVal, oldVal) => {
          if (oldVal && newVal) {
            self.table.volume = getVolumeListDetailed(newVal);
            // to update total price and volume
            setDetails().then(() => {
              filterVolume(); // orderBy is call by filterVolume();
            });
          }
        },
        true,
      );

      self.createNewVolume = function createNewVolume() {
        CucCloudMessage.info(
          $translate.instant('cpc_volume_create_volume_button_info'),
        );
        $timeout(() => {
          $state.go('iaas.pci-project.compute.infrastructure.diagram', {
            createNewVolume: true,
          });
        }, 99);
      };

      self.openDeleteVolume = function openDeleteVolume(volume) {
        CucControllerHelper.modal.showModal({
          modalConfig: {
            templateUrl:
              'app/cloud/project/compute/volume/delete/cloud-project-compute-volume-delete.html',
            controller: 'CloudProjectComputeVolumeDeleteCtrl',
            controllerAs: '$ctrl',
            resolve: {
              serviceName: () => serviceName,
              volume: () => volume,
            },
          },
          successHandler: () => {
            self.getVolume(true);
            CucCloudMessage.success(
              $translate.instant('cpc_volume_delete_success'),
            );
          },
          errorHandler: (err) =>
            CucCloudMessage.error(
              [
                $translate.instant('cpc_volume_delete_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            ),
        });
      };

      init();
    },
  );
