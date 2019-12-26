import find from 'lodash/find';

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureVolumeAddEditCtrl',
    function CloudProjectComputeInfrastructureVolumeAddEditCtrl(
      $rootScope,
      $scope,
      $stateParams,
      $timeout,
      $translate,
      atInternet,
      CloudProjectComputeVolumesOrchestrator,
      CucServiceHelper,
      CucControllerHelper,
      CucRegionService,
      CucCloudMessage,
      OvhApiCloudProjectRegion,
      OvhApiCloudProjectQuota,
      CLOUD_VOLUME_TYPES,
      CLOUD_VOLUME_MAX_SIZE,
      CLOUD_VOLUME_MIN_SIZE,
      CLOUD_VOLUME_UNLIMITED_QUOTA,
    ) {
      const self = this;

      const serviceName = $stateParams.projectId;

      self.regionService = CucRegionService;
      self.activeSwitchPageIndex = 0;

      self.volumeInEditionParam = null;
      self.volumeInEdition = {};

      self.model = {
        name: null,
      };

      self.toggle = {
        editVolumeName: false,
        accordions: {
          // accordions toggles
          regions: {},
        },
      };

      self.loaders = {
        launch: false,
        save: false,
        panelsData: {
          regions: false,
        },
        quota: false,
      };

      self.panelsData = {
        regions: [],
        types: CLOUD_VOLUME_TYPES,
        quotas: [],
      };

      self.states = {
        hasEnoughQuota: true,
      };

      self.slider = {
        min: 10,
        max: 0,
        step: 1,
      };

      // --------- INIT ---------

      function init() {
        self.getRegions();
        self.getAvailableRegions();

        self.volumeInEditionParam = CloudProjectComputeVolumesOrchestrator.getEditVolumeParam();
        CloudProjectComputeVolumesOrchestrator.setEditVolumeParam(null);

        self.volumeInEdition = CloudProjectComputeVolumesOrchestrator.getEditedVolume();
        // set model values
        self.model.name = self.volumeInEdition.name
          ? self.volumeInEdition.name
          : null;
        // minimum upscale is current volume size otherwise it would be a downscale
        if (self.volumeInEdition.status !== 'DRAFT') {
          self.slider.min = self.volumeInEdition.size || self.slider.min;
        }

        $rootScope.$broadcast(
          'cuc-highlighted-element.show',
          `compute, ${self.volumeInEdition.id}`,
        );

        // Tab loop into the popover
        $timeout(() => {
          const $popover = $('.cloud-volume-popover');
          $popover.find(':tabbable:first').focus();
          $popover.on('keydown', (e) => {
            if (e.keyCode === 9) {
              if (e.shiftKey) {
                // shift+tab
                if ($(e.target).is($popover.find(':tabbable:first'))) {
                  $popover.find(':tabbable:last').focus();
                  e.preventDefault();
                }
              } else if ($(e.target).is($popover.find(':tabbable:last'))) {
                $popover.find(':tabbable:first').focus();
                e.preventDefault();
              }
            }
          });
        }, 99);

        function editWithParam() {
          switch (self.volumeInEditionParam) {
            case 'NAME':
              self.toggleEditVolumeName();
              break;
            case 'SIZE':
              if (
                self.sectionCanBeModifiedInEdition('size') &&
                self.states.hasEnoughQuota
              ) {
                $timeout(() => {
                  self.openEditDetail('size');
                }, 500);
              }
              break;
            default:
          }
        }

        // Load quota to get availableGygabytes and compute the maximum resize value
        self.loaders.quota = true;
        OvhApiCloudProjectQuota.v6()
          .query({
            serviceName,
          })
          .$promise.then(
            (quotas) => {
              if (quotas) {
                self.panelsData.quotas = quotas;
                self.computeQuotas(self.volumeInEdition.region);
              }
              editWithParam();
            },
            (err) => {
              CucCloudMessage.error(
                [
                  $translate.instant('cpci_volume_addedit_get_quota_error'),
                  err.data.message || '',
                ].join(' '),
              );
              self.cancelVolume();
            },
          )
          .finally(() => {
            self.loaders.quota = false;
          });
      }
      // --------- TOOLS ---------

      let oldVolumeName = null;

      self.toggleEditVolumeName = function toggleEditVolumeName(cancel, ev) {
        // If [escape], close name edition
        if (ev) {
          if (ev.keyCode === 27) {
            ev.stopPropagation();
            ev.preventDefault();
          } else {
            return;
          }
        }
        // Save/Restore previous value
        if (cancel) {
          self.model.name = oldVolumeName;
        } else {
          oldVolumeName = self.model.name;
        }
        // moé...
        self.volumeInEdition.name = self.model.name;
        self.toggle.editVolumeName = !self.toggle.editVolumeName;
        // Focus first elem
        $timeout(() => {
          $('.cloud-volume-popover')
            .find(':tabbable:first')
            .focus();
        }, 99);
      };

      $scope.$on('responsive.switch.created', (evt, switcher) => {
        self.switcher = switcher;
        init();
      });

      // Open panel if toggle.editDetail is different of editDetail otherwise close this panel
      self.openEditDetail = function openEditDetail(editDetail) {
        self.toggle.editDetail = editDetail;
        self.activeSwitchPageIndex = 1;
      };

      self.backToMenu = function backToMenu() {
        if (self.switcher.getDisplayMode() === 'switch') {
          self.activeSwitchPageIndex = 0;
          self.toggle.editDetail = null;
        }
      };

      self.isSwitchMode = function isSwitchMode() {
        return self.switcher.getDisplayMode() === 'switch';
      };

      const closeOnEscapeKey = function closeOnEscapeKey(evt) {
        if (evt.which === 27) {
          self.cancelVolume();
        }
        $scope.$apply();
      };

      $(document).on('keyup', closeOnEscapeKey);

      $scope.$on('$destroy', () => {
        $(document).off('keyup', closeOnEscapeKey);
      });

      // --------- TYPE panel ---------

      $scope.$watch(
        'VolumeAddEditCtrl.volumeInEdition.type',
        (value, oldValue) => {
          if (value) {
            if (oldValue && value !== oldValue) {
              self.backToMenu();
            }
          }
        },
      );

      // --------- REGIONS panel ---------

      self.getRegions = function getRegions() {
        if (!self.loaders.panelsData.regions) {
          self.loaders.panelsData.regions = true;

          OvhApiCloudProjectRegion.v6()
            .query({
              serviceName,
            })
            .$promise.then(
              (regionsList) => {
                self.panelsData.regions = regionsList;
              },
              (err) => {
                self.panelsData.regions = null;
                CucCloudMessage.error(
                  [
                    $translate.instant('cpci_volume_addedit_image_error'),
                    err.data.message || '',
                  ].join(' '),
                );
              },
            )
            .finally(() => {
              self.loaders.panelsData.regions = false;
            });
        }
      };

      // --------- available REGIONS panel ---------

      self.getAvailableRegions = function getAvailableRegions() {
        self.availableRegions = CucControllerHelper.request.getHashLoader({
          loaderFunction: () =>
            OvhApiCloudProjectRegion.AvailableRegions()
              .v6()
              .query({ serviceName })
              .$promise.catch((error) =>
                CucServiceHelper.errorHandler(
                  'cpci_add_regions_get_available_regions_error',
                )(error),
              ),
        });
        return self.availableRegions.load();
      };

      $scope.$watch(
        'VolumeAddEditCtrl.volumeInEdition.region',
        (value, oldValue) => {
          if (value) {
            self.toggle.accordions.regions = {};
            self.toggle.accordions.regions.public = true; // @todo
            self.computeQuotas(value);
            if (oldValue && value !== oldValue) {
              self.backToMenu();
            }
          }
        },
      );

      // --------- QUOTAS ---------
      self.computeQuotas = function computeQuotas(region) {
        if (self.panelsData.quotas) {
          const quota = find(self.panelsData.quotas, { region });
          if (quota && quota.volume) {
            self.states.hasEnoughQuota = true;
            let availableGigabytes = CLOUD_VOLUME_MAX_SIZE;
            if (quota.volume.maxGigabytes !== CLOUD_VOLUME_UNLIMITED_QUOTA) {
              availableGigabytes = Math.min(
                CLOUD_VOLUME_MAX_SIZE,
                quota.volume.maxGigabytes - quota.volume.usedGigabytes,
              );
              if (availableGigabytes < CLOUD_VOLUME_MIN_SIZE) {
                self.states.hasEnoughQuota = false;
              }
            }
            self.slider.max = availableGigabytes;
            if (self.volumeInEdition.status === 'DRAFT') {
              // we cannot automatically resize volume if it is a snapshot restoration
              if (!self.volumeInEdition.snapshot) {
                self.volumeInEdition.size = Math.min(
                  self.volumeInEdition.size,
                  self.slider.max,
                );
                self.volumeInEdition.size = Math.max(
                  self.volumeInEdition.size,
                  self.slider.min,
                );
              }
            } else {
              self.slider.max = Math.min(
                CLOUD_VOLUME_MAX_SIZE,
                self.volumeInEdition.size + availableGigabytes,
              );
            }
          }
        }
      };

      // --------- VOLUME actions ---------

      self.putPostVolume = function putPostVolume() {
        self.loaders.launch = true;
        // POST
        if (self.volumeInEdition.status === 'DRAFT') {
          CloudProjectComputeVolumesOrchestrator.saveNewVolume(
            self.volumeInEdition,
          ).then(
            () => {
              $rootScope.$broadcast('cuc-highlighted-element.hide');
              CloudProjectComputeVolumesOrchestrator.turnOffVolumeEdition();
              atInternet.trackOrder({
                name: `[VOLUME]::${self.volumeInEdition.type.replace(
                  /[\W_]+/g,
                  '',
                )}[${self.volumeInEdition.type}-${self.volumeInEdition.size}]`,
                page: 'iaas::pci-project::compute::infrastructure::order',
                priceTaxFree: self.volumeInEdition.calculatePrice().monthlyPrice
                  .value,
                orderId: self.volumeInEdition.id,
              });
            },
            (err) => {
              CucCloudMessage.error(
                [
                  $translate.instant('cpci_volume_addedit_post_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
              self.loaders.launch = false;
            },
          );
        } else {
          // PUT
          CloudProjectComputeVolumesOrchestrator.saveEditedVolume(
            self.volumeInEdition,
          ).then(
            () => {
              $rootScope.$broadcast('cuc-highlighted-element.hide');
              CloudProjectComputeVolumesOrchestrator.turnOffVolumeEdition();
            },
            (err) => {
              CucCloudMessage.error(
                [
                  $translate.instant('cpci_volume_addedit_put_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
              self.loaders.launch = false;
            },
          );
        }
      };

      self.cancelVolume = function cancelVolume() {
        if (self.volumeInEdition.status === 'DRAFT') {
          CloudProjectComputeVolumesOrchestrator.deleteVolume(
            self.volumeInEdition.id,
          );
        }
        $rootScope.$broadcast(
          'cuc-highlighted-element.hide',
          `compute,${self.volumeInEdition.id}`,
        );
        CloudProjectComputeVolumesOrchestrator.turnOffVolumeEdition(true);
        $rootScope.$broadcast('infra.refresh.links.delayed');
      };

      self.isValid = function isValid() {
        // in case of snapshot, check if we have space available
        if (
          self.volumeInEdition.snapshot &&
          self.volumeInEdition.size > self.slider.max
        ) {
          return false;
        }
        return (
          self.volumeInEdition.name &&
          self.volumeInEdition.type &&
          self.volumeInEdition.size &&
          self.volumeInEdition.region
        );
      };

      self.canEditSize = function canEditSize() {
        return (
          !self.loaders.quota &&
          self.states.hasEnoughQuota &&
          self.sectionCanBeModifiedInEdition('size')
        );
      };

      // we cannot change size and type at the same time
      this.sectionCanBeModifiedInEdition = function sectionCanBeModifiedInEdition(
        section,
      ) {
        switch (section) {
          case 'region':
            return !self.volumeInEdition.snapshot;
          case 'size':
            return (
              !self.volumeInEdition.hasChange('type') &&
              !self.volumeInEdition.snapshot
            );
          case 'type':
            return (
              !self.volumeInEdition.hasChange('size') &&
              !self.volumeInEdition.snapshot
            );
          default:
            return null;
        }
      };
    },
  );
