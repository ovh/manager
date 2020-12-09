import assign from 'lodash/assign';
import concat from 'lodash/concat';
import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import keys from 'lodash/keys';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import property from 'lodash/property';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import tap from 'lodash/tap';
import thru from 'lodash/thru';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

/* eslint-disable no-use-before-define, consistent-return */
/**
 *  Add Edit VM Controller - Controls the vm creation popover
 *  =========================================================
 *
 *  =README=
 *  This controller makes queries to different API of /cloud and put datas into panelsData object :
 *  {
 *      flavors   : [],
 *      images    : [],
 *      snapshots : [],
 *      sshKeys   : []
 *  }
 *
 *  These arrays are then filtered by types for display.
 * This filters need to be refreshed when some model value change. Because each region has its own
 *  flavor and images and images types have their own flavors.
 *
 *  Note that when model value change, the associated vmInEdition
 * (the VirtualMachine factory object currently in edition) attribute is updated
 *  by finding resource object into panelsData with model id value.
 *
 *  Flavors array contains Resource objects looking like :
 *  {
 *      disk: Number,
 *      groupName: String (transformed after request response - removing 'win-' of windows flavors),
 *      id: String,
 *      name: String,
 *      osType: String,
 *      price: Object (added from /cloud/price api call),
 *      ram: Number,
 *      region: String,
 *      type: String,
 *      typeGeneric: String (transformed after request response, snakeCase of type),
 *      vcpus: Number
 *  }
 *
 *  Images array contains Resource objects looking like :
 *  {
 *      creationDate: String,
 *      distribution: String,
 *      id: String,
 *      minDisk: Number,
 *      name: String,
 *      nameGeneric: String (transformed after request response, snakeCase of image name),
 *      price: Object (setted if windows type and calculated by removing linux flavor price value
 *      of windows flavor price value - same form of price Object returned by flavor api call),
 *      region: String,
 *      status: String,
 *      type: String,
 *      visibility: String
 *  }
 *
 *  TODO : document snapshot and sshKeys if needed
 */

// TODO replace ssh.name_ssh.region by ssh.name with new API
// TODO fix bug with tooltip. If click on tooltip (quickly), popover quits
// TODO bug delete ssh key
// TODO restriction between flavor and image archi (see maxime)
// TODO default vm configuration

// les query sont cached... donc impossible de refresh le table!

// lodash in dom
// gio converter
// ssh plein de hide?
// region zone
// tooltip faite ac quoi ?

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureVirtualMachineAddEditCtrl',
    function CloudProjectComputeInfrastructureVirtualMachineAddEditCtrl(
      $filter,
      $q,
      $rootScope,
      $scope,
      $stateParams,
      $timeout,
      $translate,
      atInternet,
      CloudFlavorService,
      CloudImageService,
      CucCloudMessage,
      CloudProjectComputeInfrastructureOrchestrator,
      CucControllerHelper,
      CucPriceHelper,
      OvhApiCloudProjectSshKey,
      OvhApiCloudProjectFlavor,
      OvhApiCloudProjectImage,
      OvhApiCloudProjectNetworkPrivate,
      OvhApiCloudProjectNetworkPrivateSubnet,
      OvhApiCloudProjectNetworkPublic,
      OvhApiCloudProjectQuota,
      OvhApiCloudProjectRegion,
      OvhApiCloudProjectSnapshot,
      OvhApiMe,
      ovhDocUrl,
      CucRegionService,
      CucServiceHelper,
      CLOUD_FLAVOR_SPECIFIC_IMAGE,
      CLOUD_FLAVORTYPE_CATEGORY,
      CLOUD_INSTANCE_CPU_FREQUENCY,
      CLOUD_INSTANCE_DEFAULT_FALLBACK,
      CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES,
      REDIRECT_URLS,
      coreConfig,
      URLS,
    ) {
      const self = this;
      const orderBy = $filter('orderBy');

      const serviceName = $stateParams.projectId;

      let oldVmName = null;

      self.regionService = CucRegionService;
      self.enums = {
        flavorsTypes: [],
        imagesTypes: [],
        zonesTypes: ['public', 'dedicated'],
      };

      self.toggle = {
        editDetail: null, // Current open panel
        editVmName: null, // vm name edition
        editFlavor: 'categories',
        flavorDirty: false,
        accordions: {
          // accordions toggles
          flavors: {},
          images: {},
          regions: {},
        },
      };

      self.order = {
        by: 'price',
        reverse: false,
      };

      self.activeSwitchPageIndex = 0;

      // Loader during Datas of panels requests
      self.loaders = {
        launch: false,
        allCompleted: false,
        panelsData: {
          flavors: false,
          images: false,
          snapshots: false,
          regions: false,
          sshKeys: false,
        },
        sshKey: {
          add: false,
          remove: false,
        },
        privateNetwork: {
          subnet: {
            query: false,
          },
          query: false,
        },
        publicNetwork: {
          query: false,
        },
        urls: false,
      };

      // Datas of panels
      self.panelsData = {
        flavors: [],
        images: [],
        snapshots: [],
        sshKeys: [],
        privateNetworks: [],
        publicNetworks: [],
        subnets: [],
      };

      // Datas to display
      self.displayData = {
        shortGroupName: null,
        categories: null,
        flavors: {},
        images: {},
        quota: {},
        sshKeys: [],
      };

      self.categoriesVmInEditionFlavor = {};

      self.vmInEdition = {
        networkId: null,
      };

      self.currentFlavor = null;

      self.vmInEditionParam = null;

      // Model of virtual machine
      self.model = {
        name: null,
        flavorId: null,
        imageId: null,
        imageType: null,
        region: null,
        zone: null,
        sshKeyId: null,
        vmCount: 1,
        diskType: 'ceph',
        flex: false,
      };

      // States Store.
      self.states = {
        hasVrack: false,
        hasSetFlavor: false,
        hasOldFlavors: false,
      };

      // Contextual Urls Store.
      self.urls = {
        vlansGuide: null,
        vlansApiGuide: null,
        vrack: REDIRECT_URLS.vRack,
        guidesSshkeyURL: null,
      };

      self.recommendedFlavorName = null;

      // SSHKEYS: Add model
      function initNewSshKey() {
        self.sshKeyAdd = {
          serviceName,
          name: null,
          publicKey: null,
        };
      }
      initNewSshKey();

      // SSHKEYS: Deleted ID
      self.sshKeyDeletedId = null;

      // ---

      /*= ===========================================
    =            Display data section            =
    ============================================ */

      /*
       * - All flavors, images, snapshots, sshkeys are bind to a *region*.
       *   When user change a region, we need to update all items!
       * - User can't switch from VPS flavor to CPU/RAM flavor and vice versa.
       * - User can't downgrade a flavor.
       * - Flavors beginning with "win-" are windows-only, and are a copy of linux equivalent.
       *   We need to show price of linux for windows flavors...
       */

      /**
       *  To call when region model value change
       */
      function recalculateValues() {
        // get flavor values
        getDisplayFlavors();
        recalculateFlavor();
        // get image values
        if (
          self.vmInEdition.flavor &&
          flavorHasSpecificImages(self.vmInEdition.flavor.shortType)
        ) {
          // filter for a specific flavor
          showImages(false, self.vmInEdition.flavor);
        } else {
          showImages(true);
        }
        recalculateImage();
        // get quota to be displayed
        getDisplayQuota();
        // get ssh keys to be displayed
        getDisplaySshKeys();
        recalculateSshKey();
        // recompute vm count
        recalculateVmCount();
        // get the recommended flavour if threshold is reached
        calculateRecommendedFlavour();
      }

      // TODO: Redo this with categories.
      function calculateRecommendedFlavour() {
        if (self.vmInEdition.monitoringData) {
          let result;
          const cpuNeedUpgrade =
            self.vmInEdition.monitoringData.cpu.needUpgrade;
          const ramNeedUpgrade =
            self.vmInEdition.monitoringData.mem.needUpgrade;

          if (cpuNeedUpgrade || ramNeedUpgrade) {
            const currentFlavor = self.vmInEdition.flavor;
            self.displayData.flavors[self.vmInEdition.flavor.type].forEach(
              (flavor) => {
                if (
                  !result &&
                  (cpuNeedUpgrade
                    ? flavor.vcpus > currentFlavor.vcpus
                    : true) &&
                  (ramNeedUpgrade ? flavor.ram > currentFlavor.ram : true)
                ) {
                  result = flavor.name;
                }
              },
            );
          }

          if (result) {
            self.recommendedFlavorName = result;
          }
        }
      }

      function getDisplayFlavors() {
        // reset flavors data to display
        self.displayData.flavors = {};
        self.displayData.categories = [];
        // recalculate flavors to display

        let originalCategory = null;
        if (self.originalVm) {
          const originalFlavor = find(self.panelsData.flavors, {
            id: self.originalVm.flavor.id,
          });
          if (originalFlavor && self.vmInEdition.status === 'ACTIVE') {
            originalCategory = getCategoryFromFlavor(originalFlavor.type, true);
          }
        }
        splitFlavorsByCategories(originalCategory);
      }

      function splitFlavorsByCategories(originalCategory) {
        angular.forEach(self.enums.flavorsTypes, (flavorType) => {
          const category = getCategoryFromFlavor(flavorType, true);

          const cleanFlavors = filter(self.panelsData.flavors, (flavor) =>
            get(flavor, 'price.price.text'),
          );

          if (category && includes(category.types, flavorType)) {
            const categoryObject = find(self.displayData.categories, {
              category: category.id,
            });
            if (categoryObject) {
              categoryObject.flavors = concat(
                categoryObject.flavors,
                filter(cleanFlavors, {
                  type: flavorType,
                  diskType: 'ssd',
                  flex: false,
                  region: self.model.region,
                  osType: self.vmInEdition.image
                    ? self.vmInEdition.image.type
                    : 'linux', // (display linux flavors by default if no image selected)
                }),
              );
            } else {
              self.displayData.categories.push({
                category: category.id,
                order: category.order,
                flavors: filter(cleanFlavors, {
                  available: true,
                  type: flavorType,
                  diskType: 'ssd',
                  flex: false,
                  region: self.model.region,
                  osType: self.vmInEdition.image
                    ? self.vmInEdition.image.type
                    : 'linux', // (display linux flavors by default if no image selected)
                }),
              });
            }
          }

          if (category && originalCategory) {
            const originalCategoryObject = find(self.displayData.categories, {
              category: category.id,
            });
            originalCategoryObject.flavors.forEach((flavor) => {
              set(
                flavor,
                'migrationNotAllowed',
                includes(originalCategory.migrationNotAllowed, category.id),
              );
            });
          }
        });
        forEach(self.displayData.categories, (category) => {
          if (some(category.flavors, 'isOldFlavor')) {
            self.states.hasOldFlavors = true;
          }
        });
        // Remove flavors if OS has any restrictions,
        // for example NVIDIA OS can only be deployed on t1 or t2 instances/flavours
        const restrictedFlavors = get(self.vmInEdition, 'image.flavorType', []);
        const selectedFlavour = get(self.vmInEdition, 'flavor');
        let selectedFlavourInFilterList = false;
        if (!isEmpty(restrictedFlavors)) {
          self.displayData.categories = filter(
            self.displayData.categories,
            (category) => {
              const currentCategory = category;
              currentCategory.flavors = filter(category.flavors, (flavor) => {
                const isRestricted = includes(
                  restrictedFlavors,
                  flavor.shortType,
                );
                if (
                  !selectedFlavourInFilterList &&
                  isRestricted &&
                  selectedFlavour.id === flavor.id
                ) {
                  selectedFlavourInFilterList = true;
                }
                return isRestricted;
              });
              return currentCategory.flavors.length > 0;
            },
          );
          // check if previously selected instance is available in filtered list
          // set flavour/instance to empty if
          // previously selefcted flavour is not available in filtered list
          if (!selectedFlavourInFilterList) {
            set(self.vmInEdition, 'flavor', null);
          }
        }
        self.displayData.categories = sortBy(
          self.displayData.categories,
          'order',
        );
        // if selected flavor is not available, set to null
        if (!get(selectedFlavour, 'available')) {
          set(self.vmInEdition, 'flavor', null);
        }
      }

      function getDisplayImages(flavorType) {
        // reset images data to display
        self.displayData.images = {};
        // recalculate images to display
        angular.forEach(self.enums.imagesTypes, (imageType) => {
          // display only images types compatibles with the selected flavor
          if (self.vmInEdition.flavor) {
            if (
              !find(self.panelsData.flavors, {
                osType: imageType,
                groupName: self.vmInEdition.flavor
                  ? self.vmInEdition.flavor.groupName
                  : undefined,
              })
            ) {
              self.displayData.images[imageType] = [];
              return;
            }
          } else if (
            !find(self.panelsData.flavors, {
              osType: imageType,
            })
          ) {
            self.displayData.images[imageType] = [];
            return;
          }
          // filter images by type
          self.displayData.images[imageType] = filter(self.panelsData.images, {
            type: imageType,
            region: self.model.region,
            apps: false,
          });

          // filter GPU
          if (['g1', 'g2', 'g3', 't1'].includes(flavorType)) {
            self.displayData.images[imageType] = filter(
              self.displayData.images[imageType],
              (image) =>
                image.type === 'linux' ||
                (image.flavorType
                  ? includes(image.flavorType, flavorType)
                  : true),
            );
          } else {
            self.displayData.images[imageType] = filter(
              self.displayData.images[imageType],
              (image) => !image.flavorType,
            );
          }

          if (self.vmInEdition.flavor) {
            angular.forEach(self.displayData.images[imageType], (image) => {
              set(
                image,
                'disabled',
                self.vmInEdition.flavor.disk < image.minDisk
                  ? 'NOT_ENOUGH_SPACE'
                  : false,
              );
            });
          }
        });

        self.displayData.apps = filter(self.panelsData.images, {
          region: self.model.region,
          apps: true,
        });

        // filter snapshots by type
        self.displayData.snapshots = filter(self.panelsData.snapshots, {
          region: self.model.region,
          status: 'active',
        });

        if (self.vmInEdition.flavor) {
          angular.forEach(self.displayData.snapshots, (image) => {
            set(
              image,
              'disabled',
              self.vmInEdition.flavor.disk < image.minDisk
                ? 'NOT_ENOUGH_SPACE'
                : false,
            );
          });
        }
      }

      function getDisplayQuota() {
        // set display quota with chosen region
        self.displayData.quota = find(self.panelsData.quota, {
          region: self.model.region,
        });
      }

      function getDisplaySshKeys() {
        // Add boolean to know if sshKey is available on the selected region
        self.displayData.sshKeys = map(self.panelsData.sshKeys, (sshKey) => {
          set(
            sshKey,
            'availableOnRegion',
            sshKey.regions &&
              sshKey.regions.length &&
              sshKey.regions.indexOf(self.model.region) > -1,
          );
          return sshKey;
        });

        self.displayData.sshKeyAvailables =
          countBy(self.displayData.sshKeys, 'availableOnRegion').true || 0;
        self.displayData.sshKeyUnavailables =
          self.displayData.sshKeys.length - self.displayData.sshKeyAvailables;
      }

      self.projectHasNoSshKeys = function projectHasNoSshKeys() {
        return (
          !self.loaders.panelsData.sshKeys &&
          self.panelsData.sshKeys.length === 0
        );
      };

      this.sectionCanBeModifiedInEdition = function sectionCanBeModifiedInEdition(
        section,
      ) {
        switch (section) {
          case 'flavors':
            return !self.vmInEdition.hasChange('images');
          case 'images':
            return !self.vmInEdition.hasChange('flavors');
          default:
            return null;
        }
      };

      /* -----  End of Display data section  ------*/

      /*= ==================================================
    =            Model recalculation section            =
    =================================================== */

      function recalculateFlavor() {
        let mainAssociatedFlavor = find(
          flatten(map(self.displayData.categories, 'flavors')),
          {
            groupName:
              self.vmInEdition.flavor && self.vmInEdition.flavor.groupName,
            osType: self.vmInEdition.image
              ? self.vmInEdition.image.type
              : 'linux',
            region: self.model.region,
          },
        );

        if (!mainAssociatedFlavor) {
          // Try in old flavor panel
          mainAssociatedFlavor = find(self.panelsData.flavors, {
            groupName:
              self.vmInEdition.flavor && self.vmInEdition.flavor.groupName,
            osType: self.vmInEdition.image
              ? self.vmInEdition.image.type
              : 'linux',
            region: self.model.region,
          });
        }

        if (!mainAssociatedFlavor || mainAssociatedFlavor.disabled) {
          setFallbackFlavor();
        } else {
          self.model.flavorId = mainAssociatedFlavor.id;
          self.vmInEdition.flavor = mainAssociatedFlavor;
        }

        angular.forEach(CLOUD_FLAVORTYPE_CATEGORY, (category) => {
          self.categoriesVmInEditionFlavor[category.id] = self.getRealFlavor(
            self.categoriesVmInEditionFlavor[category.id],
            category.id,
          );
        });
      }

      function setFallbackFlavor() {
        const fallbackFlavor = find(
          flatten(map(self.displayData.categories, 'flavors')),
          {
            groupName: CLOUD_INSTANCE_DEFAULT_FALLBACK.flavor,
            osType: self.vmInEdition.image
              ? self.vmInEdition.image.type
              : 'linux',
            region: self.model.region,
          },
        );
        if (fallbackFlavor) {
          self.model.flavorId = fallbackFlavor.id;
          self.vmInEdition.flavor = fallbackFlavor;
        } else {
          self.model.flavorId = null;
          self.vmInEdition.flavor = null;
        }
      }

      function recalculateImage() {
        let associatedDisplayImage;

        let associatedImage = find(self.panelsData.images, {
          name: self.vmInEdition.image && self.vmInEdition.image.name,
          region: self.model.region,
        });

        if (associatedImage) {
          associatedDisplayImage = find(self.displayData.images, {
            id: associatedImage.id,
          });
          if (!associatedDisplayImage) {
            associatedDisplayImage = find(self.displayData.apps, {
              id: associatedImage.id,
            });
          }
        }

        if (!associatedImage) {
          associatedImage = find(self.panelsData.snapshots, {
            name: self.vmInEdition.image && self.vmInEdition.image.name,
            region: self.model.region,
          });
          if (associatedImage) {
            associatedDisplayImage = find(self.displayData.snapshots, {
              id: associatedImage.id,
            });
          }
        }

        if (
          !associatedImage ||
          (associatedDisplayImage && associatedDisplayImage.disabled)
        ) {
          self.model.imageId = null;
          self.vmInEdition.image = null;
        } else {
          self.model.imageId = associatedImage.id;
          self.vmInEdition.image = associatedImage;
        }
      }

      function recalculateSshKey() {
        const associatedSshKey = find(
          self.panelsData.sshKeys,
          (sshKey) =>
            sshKey.id === self.model.sshKeyId &&
            ~sshKey.regions.indexOf(self.model.region),
        );

        if (!associatedSshKey) {
          self.model.sshKeyId = null;
          self.vmInEdition.sshKey = null;
        } else {
          self.model.sshKeyId = associatedSshKey.id;
          self.vmInEdition.sshKey = associatedSshKey;
        }
      }

      function recalculateVmCount() {
        if (self.vmInEdition.status === 'DRAFT') {
          if (Number.isNaN(self.model.vmCount)) {
            self.model.vmCount = 1;
          } else {
            self.model.vmCount = Math.min(
              self.getMaximumInstanceCreationCount(),
              self.model.vmCount,
            );
          }
        }
      }

      /* -----  End of Model recalculation section  ------*/

      // --------- INITIALISATION ---------

      function init() {
        self.vmInEditionParam = CloudProjectComputeInfrastructureOrchestrator.getEditVmParam();
        CloudProjectComputeInfrastructureOrchestrator.setEditVmParam(null);

        // When it's a new vm, keep changes in sync and when it's a vm in edit
        // don't sync changes until apply changes
        const editedVm = CloudProjectComputeInfrastructureOrchestrator.getEditedVm();
        if (editedVm.status === 'DRAFT') {
          self.vmInEdition = editedVm;
        } else {
          self.originalVm = editedVm;
          self.vmInEdition = angular.copy(editedVm);
        }

        initURLs();
        $q.all({
          // get flavors, gets the images (for windows image price calculation), get the quotas
          flavors: self.getFlavors(),
          regions: self.getRegions(),
          availableRegions: self.getAvailableRegions(),
          sshKeys: self.getSshKeys(),
          hasVrack: CloudProjectComputeInfrastructureOrchestrator.hasVrack(),
          user: OvhApiMe.v6().get().$promise,
        })
          .then((data) => {
            self.model.name = self.vmInEdition.name;
            self.model.flavorId = self.vmInEdition.flavor
              ? self.vmInEdition.flavor.id
              : null;
            self.model.imageId = self.vmInEdition.image
              ? self.vmInEdition.image.id
              : null;
            self.model.region = self.vmInEdition.region;
            self.model.sshKeyId = self.vmInEdition.sshKey
              ? self.vmInEdition.sshKey.id
              : null;
            // dirty hack has new catalog does not support ceph
            // but changing default to ssd break old code.
            self.model.diskType =
              self.catalogVersion() === 'new' ? 'ssd' : self.model.diskType;
            self.states.hasVrack = data.hasVrack;

            const guides = URLS.guides.vlans[data.user.ovhSubsidiary];
            if (guides) {
              self.urls.vlansGuide = guides.roadmap;
            }
            recalculateValues();
            self.fetchPrivateNetworks();
            self.fetchPublicNetworks();
          })
          .then(() => {
            editWithParam();
          })
          .finally(() => {
            self.loaders.allCompleted = true;
          });

        // Tab loop into the popover
        $timeout(() => {
          const $popover = $('.cloud-vm-popover');
          $popover.find(':tabbable:first').focus();
          $popover.on('keydown', (e) => {
            if (e.keyCode === 9) {
              if (e.shiftKey) {
                // shift+tab
                if ($(e.target).is($popover.find(':tabbable:first'))) {
                  $popover.find(':tabbable:last').focus();
                  e.preventDefault();
                }
              } else {
                // tab
                // eslint-disable-next-line no-lonely-if
                if ($(e.target).is($popover.find(':tabbable:last'))) {
                  $popover.find(':tabbable:first').focus();
                  e.preventDefault();
                }
              }
            }
          });
        }, 99);

        $rootScope.$broadcast(
          'cuc-highlighted-element.show',
          `compute,${self.vmInEdition.id}`,
        );
      }

      function editWithParam() {
        switch (self.vmInEditionParam) {
          case 'NAME':
            self.toggleEditVmName();
            break;
          case 'FLAVOR':
            if (
              !self.loaders.panelsData.flavors &&
              self.sectionCanBeModifiedInEdition('flavors') &&
              !self.loaders.launch
            ) {
              $timeout(() => {
                self.openEditDetail('flavors', 'flavorId', 'type');
              }, 500);
            }
            break;
          case 'IMAGE':
            if (
              !self.loaders.panelsData.images &&
              self.sectionCanBeModifiedInEdition('images') &&
              !self.loaders.launch
            ) {
              $timeout(() => {
                self.openEditDetail('images', 'imageId', 'type');
              }, 500);
            }
            break;
          default:
        }
      }

      function initURLs() {
        self.urls.vlansApiGuide = ovhDocUrl.getDocUrl(
          'g2162.public_cloud_et_vrack_-_comment_utiliser_le_vrack_et_les_reseaux_prives_avec_les_instances_public_cloud',
        );

        if (coreConfig.getRegion() === 'US') {
          self.urls.guidesSshkeyURL = URLS.guides.ssh.create.US;
        } else {
          self.urls.guidesSshkeyURL = ovhDocUrl.getDocUrl(
            'g1769.creating_ssh_keys',
          );
        }
      }

      function getCategoryFromFlavor(flavor, details) {
        let cat = null;
        angular.forEach(CLOUD_FLAVORTYPE_CATEGORY, (category) => {
          if (includes(category.types, flavor)) {
            if (details) {
              cat = category;
            } else {
              cat = category.id;
            }
          }
        });
        return cat;
      }

      // Switch page created: INIT THE MAGIC!
      $scope.$on('responsive.switch.created', (evt, switcher) => {
        self.switcher = switcher;
        init();
      });

      function firstTimeSetFlavor(isFlavorSuggested, flavorId) {
        if (!self.states.hasSetFlavor) {
          let realFlavor;

          const flavor = find(self.panelsData.flavors, {
            id: flavorId || self.vmInEdition.flavor.id,
          });

          if (isFlavorSuggested) {
            realFlavor = self.getFlavorOfType(
              flavor,
              'ssd',
              flavor.flex,
              flavor.region,
              flavor.osType,
            );
          }

          if (!realFlavor) {
            realFlavor = flavor;
          }

          if (realFlavor && !realFlavor.disabled) {
            const category = getCategoryFromFlavor(realFlavor.type);
            if (category) {
              self.toggle.accordions.flavors = {};
              self.toggle.accordions.flavors[category] = true;
              self.categoriesVmInEditionFlavor[category] = realFlavor;
              self.displayData.shortGroupName = realFlavor.shortGroupName;
              self.model.diskType = realFlavor.diskType;
              self.model.flex = realFlavor.flex;
              self.vmInEdition.flavor = realFlavor;
            }
          }
          self.states.hasSetFlavor = true;
        }
      }

      // Open panel if toggle.editDetail is different of editDetail otherwise close this panel
      self.openEditDetail = function openEditDetail(editDetail) {
        // reset accordion value to show focus on selected input
        if (editDetail === 'flavors') {
          if (self.model.flavorId) {
            firstTimeSetFlavor(false, self.model.flavorId);
          } else {
            self.toggle.accordions.flavors = {};
          }
        }

        self.toggle.editDetail = editDetail;
        self.activeSwitchPageIndex = 1;
        self.toggle.editFlavor = 'categories';

        // On open: scroll to selected element, and set focus
        $timeout(() => {
          if (~['flavors', 'images', 'regions'].indexOf(editDetail)) {
            const $checkedRadio = $(`input[name=${editDetail}Choice]:checked`);
            if ($checkedRadio && $checkedRadio.length) {
              const $checkedRadioCtnr = $checkedRadio.closest(
                editDetail === 'flavors' ? 'tbody' : '.panel-body',
              );
              $checkedRadioCtnr.scrollTo($checkedRadio, 200, { offset: -100 });
              $checkedRadio.closest(':tabbable').focus();
            }
          } else {
            $('.cloud-vm-popover .popover-second-page')
              .find(':tabbable:first')
              .focus();
          }
        }, 500);
      };

      self.backToMenu = function backToMenu() {
        self.activeSwitchPageIndex = 0;
        self.toggle.editDetail = null;
        self.toggle.editFlavor = 'categories';
        self.states.hasSetFlavor = false;
      };

      self.isSwitchMode = function isSwitchMode() {
        return self.switcher.getDisplayMode() === 'switch';
      };

      // ---

      // --------- VM  CREATION---------

      self.getFormattedFlavorType = function getFormattedFlavorType(
        flavorType,
      ) {
        return snakeCase(flavorType);
      };

      // Returns the remaining number of instances the user can create on a given region.
      self.getRemainingInstanceQuota = function getRemainingInstanceQuota(
        region,
      ) {
        let limit = 0; // by default we assume we aren't allowed to create new instances
        // check quota
        if (self.panelsData.quota) {
          const regionQuota = find(self.panelsData.quota, { region });
          if (regionQuota && regionQuota.instance) {
            // special case: -1 is considered unlimited
            if (regionQuota.instance.maxInstances === -1) {
              limit = Infinity;
            } else {
              limit =
                regionQuota.instance.maxInstances -
                regionQuota.instance.usedInstances;
            }
          }
        }
        return limit;
      };

      self.isValid = function isValid() {
        const vm = $scope.VmAddEditCtrl.vmInEdition;
        /*
         * When editing, it's possible that the image is not found because
         * the snapshot or image has been deleted. If it's the case the user
         * still must be allowed to make changes to his vm otherwise the vm edition
         * would be disabled forever (unless he reinstall his vm with a new
         * image but he would lost all of his preciouuus data ...)
         */
        let validImageId = self.model.imageId;
        if (vm.saveForEdition && self.model.imageId === null) {
          validImageId = true;
        }
        self.sshKeyRequired =
          vm.status !== 'ACTIVE' && !(vm.image && vm.image.type !== 'linux'); // TODO C SAAAALE
        return !!(
          vm.name &&
          vm.flavor &&
          vm.flavor.price &&
          self.model.flavorId &&
          validImageId &&
          self.model.region &&
          (self.model.sshKeyId || !self.sshKeyRequired)
        );
      };

      self.putPostVM = function putPostVM() {
        self.loaders.launch = true;
        self.backToMenu();

        // POST
        if (self.vmInEdition.status === 'DRAFT') {
          /**
           * Since we're just supporting only one private network,
           * map the single network ID as a collection member on the future payload.
           */
          if (self.vmInEdition.networkId) {
            self.vmInEdition.networks = [
              { networkId: self.vmInEdition.networkId },
              { networkId: head(this.panelsData.publicNetworks).id },
            ];
          } else {
            delete self.vmInEdition.networks;
          }

          /**
           * Create multiple VMs at once
           */
          if (self.model.vmCount > 1) {
            CloudProjectComputeInfrastructureOrchestrator.saveMultipleNewVms(
              self.vmInEdition,
              self.model.vmCount,
            ).then(
              () => {
                $rootScope.$broadcast(
                  'cuc-highlighted-element.hide',
                  `compute,${self.vmInEdition.id}`,
                );
                CloudProjectComputeInfrastructureOrchestrator.turnOffVmEdition(
                  false,
                  self.vmInEdition,
                );
                CucCloudMessage.success(
                  $translate.instant('cpcivm_addedit_save_multiple_success'),
                );
                atInternet.trackOrder({
                  name: `[INSTANCE]::${self.vmInEdition.flavor.name.replace(
                    /[\W_]+/g,
                    '',
                  )}[${self.vmInEdition.flavor.name}]`,
                  page: 'iaas::pci-project::compute::infrastructure::order',
                  priceTaxFree:
                    self.vmInEdition.flavor.price.monthlyPrice.value,
                  quantity: self.model.vmCount,
                  orderId: self.vmInEdition.id,
                });
              },
              (err) => {
                CucCloudMessage.error(
                  [
                    $translate.instant('cpcivm_addedit_save_multiple_error'),
                    (err.data && err.data.message) || '',
                  ].join(' '),
                );
                self.loaders.launch = false;
              },
            );
            /**
             * Create just one VM
             */
          } else {
            CloudProjectComputeInfrastructureOrchestrator.saveNewVm(
              self.vmInEdition,
            ).then(
              () => {
                $rootScope.$broadcast(
                  'cuc-highlighted-element.hide',
                  `compute,${self.vmInEdition.id}`,
                );
                CloudProjectComputeInfrastructureOrchestrator.turnOffVmEdition(
                  false,
                  self.vmInEdition,
                );
                atInternet.trackOrder({
                  name: `[INSTANCE]::${self.vmInEdition.flavor.name.replace(
                    /[\W_]+/g,
                    '',
                  )}[${self.vmInEdition.flavor.name}]`,
                  page: 'iaas::pci-project::compute::infrastructure::order',
                  priceTaxFree:
                    self.vmInEdition.flavor.price.monthlyPrice.value,
                  orderId: self.vmInEdition.id,
                });
              },
              (err) => {
                if (err && err.status === 409) {
                  CucCloudMessage.error(
                    $translate.instant('cpcivm_edit_vm_post_error_overquota'),
                  );
                } else {
                  CucCloudMessage.error(
                    [
                      $translate.instant('cpcivm_edit_vm_post_error'),
                      (err.data && err.data.message) || '',
                    ].join(' '),
                  );
                }
                self.loaders.launch = false;
              },
            );
          }
        } else {
          // PUT
          CloudProjectComputeInfrastructureOrchestrator.saveEditedVm(
            self.vmInEdition,
          ).then(
            () => {
              $rootScope.$broadcast(
                'cuc-highlighted-element.hide',
                `compute,${self.vmInEdition.id}`,
              );
              CloudProjectComputeInfrastructureOrchestrator.turnOffVmEdition(
                false,
                self.vmInEdition,
              );
            },
            (err) => {
              if (err && err.status === 409) {
                CucCloudMessage.error(
                  $translate.instant('cpcivm_edit_vm_post_error_overquota'),
                );
              } else {
                // eslint-disable-next-line no-shadow
                angular.forEach(err.errors, (err) => {
                  CucCloudMessage.error(
                    [
                      $translate.instant(
                        `cpcivm_edit_vm_${err.requestName}_error`,
                      ),
                      err.error.message || '',
                    ].join(' '),
                  );
                });
              }
              self.loaders.launch = false;
            },
          );
        }
      };

      this.cancelVm = function cancelVm() {
        // delete vm if it's a draft
        if (self.vmInEdition.status === 'DRAFT') {
          CloudProjectComputeInfrastructureOrchestrator.deleteVm(
            self.vmInEdition,
          );
        }
        $rootScope.$broadcast(
          'cuc-highlighted-element.hide',
          `compute,${self.vmInEdition.id}`,
        );
        CloudProjectComputeInfrastructureOrchestrator.turnOffVmEdition(true);
      };

      const closeOnEscapeKey = function closeOnEscapeKey(evt) {
        if (evt.which === 27) {
          self.cancelVm();
        }
        $scope.$apply();
      };

      $(document).on('keyup', closeOnEscapeKey);

      $scope.$on('$destroy', () => {
        $(document).off('keyup', closeOnEscapeKey);
      });

      // --------- MODELS watchs ---------

      $scope.$watch('VmAddEditCtrl.model.imageId', (value, oldValue) => {
        if (value) {
          const selectedSnapshot = find(self.panelsData.snapshots, {
            id: value,
          });
          // Set type: OS or Snapshot
          self.model.imageType = selectedSnapshot ? 'SNAPSHOT' : 'IMAGE';

          if (self.model.imageType === 'IMAGE') {
            self.vmInEdition.image = find(self.panelsData.images, {
              id: value,
            });
            self.toggle.accordions.images = {};
            if (self.vmInEdition.image.apps) {
              self.toggle.accordions.images.apps = true;
            } else {
              self.toggle.accordions.images[self.vmInEdition.image.type] = true;
            }

            recalculateValues();
          } else {
            self.vmInEdition.image = selectedSnapshot;
            // This snapshot is deleted
            if (!self.vmInEdition.image) {
              self.vmInEdition.image = {
                id: value,
                type: 'unknown',
              };
            }

            self.toggle.accordions.images = {};
            self.toggle.accordions.images.snapshots = true;

            recalculateValues();
          }

          // reset ssh if windows
          if (self.vmInEdition.image.type === 'windows') {
            self.vmInEdition.sshKey = null;
            self.model.sshKeyId = null;
          }

          // only allow install scripts for linux images
          if (self.vmInEdition.image.type !== 'linux') {
            self.vmInEdition.userData = null;
          }

          if (oldValue && value !== oldValue) {
            self.backToMenu();
          }
        }
      });

      $scope.$watch('VmAddEditCtrl.model.region', (value, oldValue) => {
        if (value) {
          self.vmInEdition.region = value;
          self.toggle.accordions.regions = {};
          self.toggle.accordions.regions.public = true; // @todo

          // recalculate display values
          recalculateValues();
          if (oldValue && value !== oldValue) {
            self.backToMenu();
          }

          // if changing the region after a vlan has been picked
          // keep it selected if also available in the new region
          // select none if not available in the new region (silently and that ok...)
          const network = find(
            self.panelsData.privateNetworks,
            // eslint-disable-next-line no-shadow
            (network) => network.id === self.vmInEdition.networkId,
          );

          if (angular.isDefined(network)) {
            if (!includes(map(network.regions, 'region'), value)) {
              self.vmInEdition.networkId = undefined;
            }
          }
        }
      });

      $scope.$watch('VmAddEditCtrl.model.sshKeyId', (value, oldValue) => {
        if (value) {
          const sshkey = find(self.panelsData.sshKeys, { id: value });
          if (!sshkey || !sshkey.availableOnRegion) {
            return;
          }
          self.vmInEdition.sshKey = sshkey;

          if (value !== oldValue) {
            self.backToMenu();
          }
        }
      });

      $scope.$watchCollection(
        'VmAddEditCtrl.toggle.accordions.flavors',
        (value, oldValue) => {
          if (value !== oldValue) {
            const chosen = keys(pickBy(value, (key) => key));
            if (chosen.length === 1) {
              self.changeCategory(chosen[0]);
            }
          }
        },
      );

      // ---

      // --------- VM NAME ---------

      self.canEditName = function canEditName() {
        return self.loaders.allCompleted;
      };

      // cancel: true/false: force close if true
      // ev: $event given by keyup
      self.toggleEditVmName = function toggleEditVmName(cancel, ev) {
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
          self.model.name = oldVmName;
        } else {
          oldVmName = self.model.name;
        }

        // moé...
        self.vmInEdition.name = self.model.name;

        self.toggle.editVmName = !self.toggle.editVmName;

        // Focus first elem
        $timeout(() => {
          $('.cloud-vm-popover').find(':tabbable:first').focus();
        }, 99);
      };

      // --------- FLAVORS panel ---------

      self.getFlavors = function getFlavors() {
        if (!self.loaders.panelsData.flavors) {
          self.loaders.panelsData.flavors = true;

          return $q
            .all([
              OvhApiCloudProjectFlavor.v6()
                .query({
                  serviceName,
                })
                .$promise.then(
                  (flavorsList) => {
                    // clear cache only on success of function
                    OvhApiCloudProjectFlavor.v6().resetQueryCache();
                    OvhApiCloudProjectFlavor.v6().resetCache();

                    const modifiedFlavorsList = flavorsList.map((flavor) =>
                      CloudFlavorService.augmentFlavor(flavor),
                    );

                    // Flavor types (ovh.ram, ovh.cpu, ...)
                    self.enums.flavorsTypes = uniq(
                      map(modifiedFlavorsList, 'type'),
                    );

                    const flavorInList = find(modifiedFlavorsList, {
                      id: self.vmInEdition.flavor && self.vmInEdition.flavor.id,
                    });

                    // if not in the list: it's a deprecated flavor: directly get it!
                    if (
                      !flavorInList &&
                      self.vmInEdition.flavor &&
                      self.vmInEdition.flavor.id
                    ) {
                      return OvhApiCloudProjectFlavor.v6()
                        .get({
                          serviceName,
                          flavorId: self.vmInEdition.flavor.id,
                        })
                        .$promise.then((flavorDeprecated) => {
                          set(flavorDeprecated, 'deprecated', true);
                          flavorsList.push(flavorDeprecated);
                          self.panelsData.flavors = modifiedFlavorsList;
                        });
                    }
                    self.panelsData.flavors = modifiedFlavorsList;
                    if (!self.vmInEdition.flavor) {
                      // this is a snapshot           to review
                      recalculateFlavor();
                    }
                    if (self.vmInEdition.status === 'ACTIVE') {
                      self.currentFlavor = CloudFlavorService.augmentFlavor(
                        self.vmInEdition.flavor,
                      );
                    }

                    connectFlavorTogether();
                  },
                  (err) => {
                    CucCloudMessage.error(
                      [
                        $translate.instant('cpcivm_addedit_flavor_error'),
                        err.data.message || '',
                      ].join(' '),
                    );
                    return $q.reject(err);
                  },
                ),
              OvhApiCloudProjectQuota.v6()
                .query({
                  serviceName,
                })
                .$promise.then(
                  (quota) => {
                    self.panelsData.quota = quota;
                  },
                  (err) => {
                    CucCloudMessage.error(
                      [
                        $translate.instant('cpcivm_addedit_quota_error'),
                        err.data.message || '',
                      ].join(' '),
                    );
                    self.cancelVm();
                    return $q.reject(err);
                  },
                ),
              CucPriceHelper.getPrices(serviceName).then(
                (flavorsPrices) => {
                  self.panelsData.prices = flavorsPrices;
                },
                (err) => {
                  CucCloudMessage.error(
                    [
                      $translate.instant('cpcivm_addedit_flavor_price_error'),
                      err.data.message || '',
                    ].join(' '),
                  );
                  return $q.reject(err);
                },
              ),
              self.getImages(),
              self.getSnapshots(),
            ])
            .then(
              () => {
                // Operations on flavors:
                angular.forEach(self.panelsData.flavors, (flavor) => {
                  // add frequency
                  set(
                    flavor,
                    'frequency',
                    CLOUD_INSTANCE_CPU_FREQUENCY[flavor.type],
                  );

                  // add price infos
                  const price = {
                    price: { value: 0 },
                    monthlyPrice: { value: 0 },
                  };
                  const planHourly =
                    self.panelsData.prices[flavor.planCodes.hourly];
                  if (planHourly) {
                    price.price = planHourly.price;
                    // Set 3 digits for hourly price
                    price.price.text = price.price.text.replace(
                      /\d+(?:[.,]\d+)?/,
                      `${price.price.value.toFixed(3)}`,
                    );
                  }
                  const planMonthly =
                    self.panelsData.prices[flavor.planCodes.monthly];
                  if (planMonthly) {
                    price.monthlyPrice = planMonthly.price;
                  }

                  set(flavor, 'price', price);
                  const currentFlavorUsage = {
                    vcpus: 0,
                    ram: 0,
                  };

                  // [EDITION] only:
                  if (
                    self.vmInEdition.status === 'ACTIVE' &&
                    self.vmInEdition.saveForEdition &&
                    self.vmInEdition.saveForEdition.flavor &&
                    self.vmInEdition.saveForEdition.flavor.id
                  ) {
                    // set edited vm usage
                    currentFlavorUsage.vcpus =
                      self.vmInEdition.saveForEdition.flavor.vcpus;
                    currentFlavorUsage.ram =
                      self.vmInEdition.saveForEdition.flavor.ram;

                    // Disk: disable flavor if not enough space
                    if (
                      self.currentFlavor.diskType === 'ssd' &&
                      flavor.diskType === 'ceph'
                    ) {
                      const ssdEquivalentFlavor = self.getFlavorOfType(
                        flavor,
                        'ssd',
                        false,
                        flavor.region,
                        flavor.osType,
                      );
                      if (
                        ssdEquivalentFlavor &&
                        ssdEquivalentFlavor.disk < self.currentFlavor.disk
                      ) {
                        set(flavor, 'disabled', 'NOT_ENOUGH_SPACE');
                      }
                    } else if (
                      self.currentFlavor.diskType === 'ceph' &&
                      flavor.diskType === 'ssd'
                    ) {
                      const cephEquivalentFlavor = self.getFlavorOfType(
                        flavor,
                        'ceph',
                        false,
                        flavor.region,
                        flavor.osType,
                      );
                      if (
                        cephEquivalentFlavor &&
                        cephEquivalentFlavor.disk < self.currentFlavor.disk
                      ) {
                        set(flavor, 'disabled', 'NOT_ENOUGH_SPACE');
                      }
                    } else if (
                      flavor.disk &&
                      flavor.disk < self.vmInEdition.saveForEdition.flavor.disk
                    ) {
                      set(flavor, 'disabled', 'NOT_ENOUGH_SPACE');
                    }
                  }

                  // Disable flavors regarding of user's quota
                  const quotaOfFlavorRegion = find(self.panelsData.quota, {
                    region: flavor.region,
                  });
                  if (quotaOfFlavorRegion && quotaOfFlavorRegion.instance) {
                    // Quota: Cores
                    if (
                      flavor.vcpus &&
                      quotaOfFlavorRegion.instance.maxCores !== -1 &&
                      flavor.vcpus >
                        quotaOfFlavorRegion.instance.maxCores -
                          (quotaOfFlavorRegion.instance.usedCores -
                            currentFlavorUsage.vcpus)
                    ) {
                      set(flavor, 'disabled', 'QUOTA_VCPUS');
                    }
                    // Quota: RAM
                    if (
                      flavor.ram &&
                      quotaOfFlavorRegion.instance.maxRam !== -1 &&
                      flavor.ram >
                        quotaOfFlavorRegion.instance.maxRam -
                          (quotaOfFlavorRegion.instance.usedRAM -
                            currentFlavorUsage.ram)
                    ) {
                      set(flavor, 'disabled', 'QUOTA_RAM');
                    }
                    // Quota: Instances
                    // We only check DRAFT status (creation) because editing an existing VM
                    // doest not create new instances
                    if (
                      self.vmInEdition.status === 'DRAFT' &&
                      self.getRemainingInstanceQuota(flavor.region) <= 0
                    ) {
                      set(flavor, 'disabled', 'QUOTA_INSTANCE');
                    }
                  }

                  // Edition only : check compatible flavors that can be selected
                  if (
                    self.vmInEdition.status === 'ACTIVE' &&
                    self.vmInEdition.flavor &&
                    self.vmInEdition.flavor.type
                  ) {
                    if (!checkFlavorCompatibility(flavor, self.currentFlavor)) {
                      set(flavor, 'incompatible', true);
                    }
                  }
                });
                // calculate windows licence price
                const windowsFlavors = filter(self.panelsData.flavors, {
                  osType: 'windows',
                });

                const windowsLicences = filter(self.panelsData.images, {
                  type: 'windows',
                }).concat(
                  filter(self.panelsData.snapshots, { type: 'windows' }),
                );

                let associatedLinuxFlavor;
                let calculatedPriceValue;
                let calculatedMonthlyPriceValue;

                // set price to each windows licence
                angular.forEach(windowsFlavors, (windowsFlavor) => {
                  associatedLinuxFlavor = find(self.panelsData.flavors, {
                    osType: 'linux',
                    region: windowsFlavor.region,
                    groupName: windowsFlavor.groupName,
                  });

                  if (associatedLinuxFlavor) {
                    // Put associated Linux Flavor into this Windows Flavor
                    set(
                      windowsFlavor,
                      'associatedLinuxFlavor',
                      associatedLinuxFlavor,
                    );

                    // For each Windows Image, add price diff for each flavor type
                    angular.forEach(windowsLicences, (windowsLicence) => {
                      if (!windowsLicence.price) {
                        set(windowsLicence, 'price', {});
                      }
                      if (
                        !windowsFlavor.price ||
                        !associatedLinuxFlavor.price
                      ) {
                        return;
                      }

                      // calculate licence additionnal price
                      calculatedPriceValue = parseFloat(
                        (
                          windowsFlavor.price.price.value -
                          associatedLinuxFlavor.price.price.value
                        ).toFixed(3),
                      );
                      calculatedMonthlyPriceValue = parseFloat(
                        (
                          windowsFlavor.price.monthlyPrice.value -
                          associatedLinuxFlavor.price.monthlyPrice.value
                        ).toFixed(2),
                      );
                      // set windows licence additionnal price
                      // eslint-disable-next-line no-param-reassign
                      windowsLicence.price[windowsFlavor.groupName] = {
                        price: {
                          currencyCode:
                            associatedLinuxFlavor.price.price.currencyCode,
                          text: `${calculatedPriceValue} ${associatedLinuxFlavor.price.price.currencyCode}`,
                          value: calculatedPriceValue,
                        },
                        monthlyPrice: {
                          currencyCode:
                            associatedLinuxFlavor.price.monthlyPrice
                              .currencyCode,
                          text: `${calculatedMonthlyPriceValue} ${associatedLinuxFlavor.price.monthlyPrice.currencyCode}`,
                          value: calculatedMonthlyPriceValue,
                        },
                      };
                    });
                  }
                });
                if (self.vmInEdition.isFlavorSuggested) {
                  firstTimeSetFlavor(true);
                } else if (
                  self.vmInEdition.status === 'ACTIVE' &&
                  self.vmInEdition.flavor &&
                  self.vmInEdition.flavor.type
                ) {
                  firstTimeSetFlavor();
                }
              },
              (err) => {
                self.panelsData.flavors = null;
                self.panelsData.prices = null;
                return $q.reject(err);
              },
            )
            .finally(() => {
              self.loaders.panelsData.flavors = false;
            });
        }
      };

      // eslint-disable-next-line no-shadow
      self.viewFlavorsList = function viewFlavorsList(orderBy, category) {
        self.toggle.editFlavor = 'flavors';
        self.orderBy(orderBy, category, self.order.reverse);
      };

      self.orderBy = function orderByFilter(by, category, reverse) {
        let filters = [];
        self.order.by = by;
        self.order.reverse = !!reverse;
        switch (by) {
          case 'vcpus':
            filters = filters.concat(['vcpus', 'frequency', 'disk', 'ram']);
            break;
          case 'ram':
            filters = filters.concat(['ram', 'disk', 'vcpus', 'frequency']);
            break;
          case 'price.price.value':
            filters = filters.concat([
              'price.price.value',
              'vcpus',
              'frequency',
              'disk',
            ]);
            break;
          case 'disk':
            filters = filters.concat(['disk', 'vcpus', 'frequency']);
            break;
          default:
            filters = filters.concat([
              'price.price.value',
              'vcpus',
              'frequency',
              'disk',
            ]);
            break;
        }
        const categoryObject = find(self.displayData.categories, { category });
        categoryObject.flavors = orderBy(
          categoryObject.flavors,
          filters,
          self.order.reverse,
        );
      };

      self.onMouseEnterFlavor = function onMouseEnterFlavor() {
        // Decorated function at runtime
      };

      self.selectFlavor = function selectFlavor(category, flavor) {
        let realFlavor = self.getRealFlavor(flavor);

        if (!realFlavor) {
          realFlavor = flavor;
        }

        const changedDiskType = flavor.diskType !== realFlavor.diskType;

        // If we're switching from ceph to ssd or ssd to ceph..
        // we have to make sure the user is not downscaling.
        let isDownscaling = false;
        if (
          self.vmInEdition.status !== 'DRAFT' &&
          realFlavor.disk < self.originalVm.flavor.disk
        ) {
          if (changedDiskType) {
            isDownscaling = true;
          } else {
            // If it seems we are downscaling, we check the other disk type first
            // to see if another option is available.
            const otherDiskEquivalentFlavor = self.getFlavorOfType(
              flavor,
              realFlavor.diskType === 'ssd' ? 'ceph' : 'ssd',
              false,
              realFlavor.region,
              realFlavor.osType,
            );
            if (otherDiskEquivalentFlavor.disk >= self.originalVm.flavor.disk) {
              self.model.diskType = otherDiskEquivalentFlavor.diskType;
              realFlavor = otherDiskEquivalentFlavor;
            }
          }
        }

        if (!isDownscaling && isUndefined(realFlavor.disabled)) {
          self.categoriesVmInEditionFlavor[category] = realFlavor;
          self.displayData.shortGroupName = realFlavor.shortGroupName;
          self.model.flavorId = realFlavor.id;
          self.vmInEdition.flavor = realFlavor;
          // set price of vmInEdition with price of flavor
          self.vmInEdition.price = self.vmInEdition.flavor.price;
          self.toggle.flavorDirty = true;
          recalculateValues();
          self.toggle.editFlavor = 'categories';
        }
      };

      self.isIncompatible = function isIncompatible(category, diskType) {
        // check disk compatibility
        if (diskType) {
          if (self.vmInEdition.status === 'ACTIVE') {
            const augmentedFlavor = CloudFlavorService.augmentFlavor(
              self.originalVm.flavor,
            );
            // It should always be impossible to switch from an existing SSD instance
            // to a ceph instance.
            if (augmentedFlavor.diskType === 'ssd' && diskType === 'ceph') {
              return true;
            }

            return augmentedFlavor.flex && augmentedFlavor.diskType === 'ceph';
          }
          const realFlavor = self.getFlavorOfCurrentRegionAndOSType(
            self.categoriesVmInEditionFlavor[category],
            diskType,
            self.model.flex,
          );
          return !flavorIsValid(realFlavor);
        }
        // check if flex exists
        const flexSsd = self.getFlavorOfCurrentRegionAndOSType(
          self.categoriesVmInEditionFlavor[category],
          'ssd',
          true,
        );
        const flexCeph = self.getFlavorOfCurrentRegionAndOSType(
          self.categoriesVmInEditionFlavor[category],
          'ceph',
          true,
        );

        // TODO: Refactor this to be more beautiful
        if (self.vmInEdition.status === 'ACTIVE') {
          if (self.model.diskType === 'ssd') {
            if (flavorIsValid(flexSsd)) {
              return (
                self.currentFlavor &&
                self.currentFlavor.flex === false &&
                !self.currentFlavor.vps
              );
            }
            self.model.flex = false;
            return true;
          }
          if (flavorIsValid(flexCeph)) {
            return (
              self.currentFlavor &&
              self.currentFlavor.flex === false &&
              !self.currentFlavor.vps
            );
          }
          self.model.flex = false;
          return true;
        }
        if (flavorIsValid(flexSsd) && flavorIsValid(flexCeph)) {
          return (
            self.currentFlavor &&
            self.currentFlavor.flex === false &&
            !self.currentFlavor.vps
          );
        }
        self.model.flex = false;
        return true;
      };

      self.selectDiskType = function selectDiskType(diskType, category) {
        self.model.diskType = diskType;
        self.selectFlavor(category, self.categoriesVmInEditionFlavor[category]);
      };

      self.hasGuaranteedRessources = function hasGuaranteedRessources(
        flavorType,
      ) {
        return find(
          CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES,
          (elem) => elem === flavorType,
        );
      };

      /**
       * We dont support OS and flavour change at same time.
       * NVIDIA OS supported only in t1 and t2 instances.
       * If previous flavour is not t1 or t2, dont allow to select NVIDIA.
       * This is also applicable for other images with restricted flavours.
       */
      self.isImageSelectableInEditMode = function isImageSelectableInEditMode(
        image,
      ) {
        const flavorTypes = get(image, 'flavorType', []);
        if (self.vmInEdition.status === 'DRAFT' || isEmpty(flavorTypes)) {
          return true;
        }
        const flavorType = get(self.vmInEdition, 'flavor.shortType', null);
        return includes(flavorTypes, flavorType);
      };

      self.getRealFlavor = function getRealFlavor(flavor, category) {
        const osType = self.vmInEdition.image
          ? self.vmInEdition.image.type
          : 'linux';
        const flex = category === 'accelerated' ? false : self.model.flex;
        return self.getFlavorOfType(
          flavor,
          self.model.diskType,
          flex,
          self.model.region,
          osType,
        );
      };

      self.getFlavorOfCurrentRegionAndOSType = function getFlavorOfCurrentRegionAndOSType(
        flavor,
        diskType,
        flex,
      ) {
        const osType = self.vmInEdition.image
          ? self.vmInEdition.image.type
          : 'linux';
        return self.getFlavorOfType(
          flavor,
          diskType,
          flex,
          self.model.region,
          osType,
        );
      };

      self.getFlavorOfType = function getFlavorOfType(
        flavor,
        diskType,
        flex,
        region,
        osType,
      ) {
        if (flavor) {
          if (flavor.vps) {
            return flavor;
          }
          return find(
            flavor.similarFlavors,
            (similarFlavor) =>
              similarFlavor.diskType === diskType &&
              similarFlavor.flex === flex &&
              similarFlavor.region === region &&
              similarFlavor.osType === osType,
          );
        }
        return undefined;
      };

      function flavorIsValid(flavor) {
        return (
          flavor &&
          !flavor.deprecated &&
          !flavor.disabled &&
          !flavor.incompatible
        );
      }

      function connectFlavorTogether() {
        const flavorList = self.panelsData.flavors;
        angular.forEach(self.panelsData.flavors, (flavor) => {
          if (isUndefined(flavor.vps)) {
            set(
              flavor,
              'similarFlavors',
              filter(
                flavorList,
                (flavorToCompare) =>
                  flavor.shortGroupName === flavorToCompare.shortGroupName,
              ),
            );
          }
        });
      }

      function checkFlavorCompatibility(fromFlavor, toFlavor) {
        return fromFlavor.diskType === toFlavor.diskType;
      }

      // --------- CATEGORIES panel ---------

      self.isCurrentCategory = function isCurrentCategory(category) {
        return !isEmpty(self.categoriesVmInEditionFlavor[category]);
      };

      self.changeCategory = function changeCategory(category) {
        if (isUndefined(self.categoriesVmInEditionFlavor[category])) {
          // select the first VM of the category as the default (i.e: displayed info on the panel)
          self.orderBy('vcpus', category);
          self.categoriesVmInEditionFlavor[category] = {};
        } else {
          self.selectFlavor(
            category,
            self.categoriesVmInEditionFlavor[category],
          );
          // we are in the same category as the current vm, current VM info will be displayed
          // on the panel, nothing to do.
        }
        self.toggle.editFlavor = 'categories';
      };

      // --------- IMAGES+SNAPSHOTS panel ---------

      self.getImages = function getImages() {
        if (!self.loaders.panelsData.images) {
          self.loaders.panelsData.images = true;
          return OvhApiCloudProjectImage.v6()
            .query({
              serviceName,
            })
            .$promise.then((imagesList) => {
              // Image types (linux, windows, ...)
              self.enums.imagesTypes = uniq(map(imagesList, 'type'));
              // [EDITION] only: restrict os type choice to current edited vm os type
              // (windows if windows, linux if linux)
              if (
                self.vmInEdition.status === 'ACTIVE' &&
                self.vmInEdition.image
              ) {
                self.enums.imagesTypes = [self.vmInEdition.image.type];
              }

              // check if vm in edition image is in list. If not, push it in imagesList
              const imageInList = find(imagesList, {
                id: self.vmInEdition.image && self.vmInEdition.image.id,
              });

              if (
                !imageInList &&
                self.vmInEdition.image &&
                self.vmInEdition.image.id &&
                self.vmInEdition.image.visibility === 'public'
              ) {
                return OvhApiCloudProjectImage.v6()
                  .get({
                    serviceName,
                    imageId: self.vmInEdition.image.id,
                  })
                  .$promise.then((imageDeprecated) => {
                    set(imageDeprecated, 'deprecated', true);
                    imagesList.push(imageDeprecated);
                    self.panelsData.images = imagesList; // filter on public is already done
                  });
              }
              self.panelsData.images = imagesList; // filter on public is already done

              self.panelsData.images = uniqBy(self.panelsData.images, 'id');
              self.panelsData.images = map(
                self.panelsData.images,
                CloudImageService.constructor.augmentImage,
              );
            })
            .catch((err) => {
              self.panelsData.images = null;
              CucCloudMessage.error(
                [
                  $translate.instant('cpcivm_addedit_image_error'),
                  err.data.message || '',
                ].join(' '),
              );
            })
            .finally(() => {
              self.loaders.panelsData.images = false;
            });
        }
      };

      self.getSnapshots = function getSnapshots() {
        if (!self.loaders.panelsData.snapshots) {
          self.loaders.panelsData.snapshots = true;
          return OvhApiCloudProjectSnapshot.v6()
            .query({
              serviceName,
            })
            .$promise.then(
              (snapshotList) => {
                self.panelsData.snapshots = filter(snapshotList, {
                  status: 'active',
                });

                // [EDITION] only: restrict snapshots type choice to current edited vm snapshot type
                // (windows if windows, linux if linux)
                if (
                  self.vmInEdition.status === 'ACTIVE' &&
                  self.vmInEdition.image
                ) {
                  self.panelsData.snapshots = filter(
                    self.panelsData.snapshots,
                    { type: self.vmInEdition.image.type },
                  );
                }
              },
              (err) => {
                self.panelsData.snapshots = null;
                CucCloudMessage.error(
                  [
                    $translate.instant('cpcivm_addedit_image_snapshot_error'),
                    err.data.message || '',
                  ].join(' '),
                );
              },
            )
            .finally(() => {
              self.loaders.panelsData.snapshots = false;
            });
        }
      };

      function showImages(showAll, flavor) {
        if (showAll) {
          getDisplayImages();
        } else if (flavor) {
          getDisplayImages(flavor.shortType);
        } else {
          getDisplayImages();
        }
      }

      function flavorHasSpecificImages(flavorShortType) {
        return includes(CLOUD_FLAVOR_SPECIFIC_IMAGE, flavorShortType);
      }

      // --------- REGIONS panel ---------

      self.getRegions = function getRegions() {
        if (!self.loaders.panelsData.regions) {
          self.loaders.panelsData.regions = true;

          return OvhApiCloudProjectRegion.v6()
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
                    $translate.instant('cpcivm_addedit_image_error'),
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

      // --------- AVAILABLE REGIONS panel ---------

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

      // --------- SSHKEYS panel ---------

      self.getSshKeys = function getSshKeys(clearCache) {
        if (!self.loaders.panelsData.sshKeys) {
          self.loaders.panelsData.sshKeys = true;
          if (clearCache) {
            OvhApiCloudProjectSshKey.v6().resetQueryCache();
          }
          return OvhApiCloudProjectSshKey.v6()
            .query({
              serviceName,
            })
            .$promise.then(
              (sshList) => {
                self.panelsData.sshKeys = sshList;
                self.sshKeyDeletedId = null;

                if (sshList.length === 0) {
                  self.toggleAddSshKey();
                }
                // get display ssh
                getDisplaySshKeys();
              },
              (err) => {
                self.panelsData.sshKeys = null;
                CucCloudMessage.error(
                  [
                    $translate.instant('cpcivm_addedit_sshkey_error'),
                    err.data.message || '',
                  ].join(' '),
                );
              },
            )
            .finally(() => {
              self.loaders.panelsData.sshKeys = false;
            });
        }
      };

      self.postSshKey = function postSshKey() {
        if (!self.loaders.sshKey.add) {
          const uniqKey = find(
            self.panelsData.sshKeys,
            (sshKey) => sshKey.name === self.sshKeyAdd.name,
          );

          if (uniqKey) {
            CucCloudMessage.info(
              $translate.instant('cpcivm_addedit_sshkey_add_submit_name_error'),
            );
            return;
          }

          self.loaders.sshKey.add = true;
          return OvhApiCloudProjectSshKey.v6()
            .save(
              {
                serviceName,
              },
              {
                name: self.sshKeyAdd.name,
                publicKey: self.sshKeyAdd.publicKey,
              },
            )
            .$promise.then(
              (newSshKey) => {
                self.toggleAddSshKey();
                return self.getSshKeys(true).then(() => {
                  self.model.sshKeyId = newSshKey.id;
                  CucCloudMessage.success(
                    $translate.instant(
                      'cpcivm_addedit_sshkey_add_submit_success',
                    ),
                  );
                });
              },
              (err) => {
                CucCloudMessage.error(
                  [
                    $translate.instant(
                      'cpcivm_addedit_sshkey_add_submit_error',
                    ),
                    err.data.message || '',
                  ].join(' '),
                );
              },
            )
            .finally(() => {
              self.loaders.sshKey.add = false;
            });
        }
      };

      self.sshKeyAddRegion = function sshKeyAddRegion(sshKey) {
        self.loaders.sshKey.add = true;
        return OvhApiCloudProjectSshKey.v6()
          .save(
            {
              serviceName,
            },
            {
              name: sshKey.name,
              publicKey: sshKey.publicKey,
              region: self.model.region,
            },
          )
          .$promise.then((newSshKey) =>
            self.getSshKeys(true).then(() => {
              self.model.sshKeyId = newSshKey.id;
              CucCloudMessage.success(
                $translate.instant('cpcivm_addedit_sshkey_add_submit_success'),
              );
            }),
          )
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cpcivm_addedit_sshkey_add_submit_error'),
                err.data.message || '',
              ].join(' '),
            );
          })
          .finally(() => {
            self.loaders.sshKey.add = false;
          });
      };

      self.deleteSshKey = function deleteSshKey(keyId) {
        if (!self.loaders.sshKey.remove) {
          self.loaders.sshKey.remove = true;
          return OvhApiCloudProjectSshKey.v6()
            .remove({
              serviceName,
              keyId,
            })
            .$promise.then(
              () =>
                self.getSshKeys(true).then(() => {
                  if (keyId === self.model.sshKeyId) {
                    self.model.sshKeyId = null;
                  }
                  CucCloudMessage.success(
                    $translate.instant('cpcivm_addedit_sshkey_delete_success'),
                  );
                }),
              (err) => {
                CucCloudMessage.error(
                  [
                    $translate.instant('cpcivm_addedit_sshkey_delete_error'),
                    err.data.message || '',
                  ].join(' '),
                );
              },
            )
            .finally(() => {
              self.loaders.sshKey.remove = false;
            });
        }
      };

      self.toggleAddSshKey = function toggleAddSshKey() {
        if (self.toggle.openAddSshKey) {
          initNewSshKey();
        }
        self.toggle.openAddSshKey = !self.toggle.openAddSshKey;
      };

      // return the maximum number of instances the user can create, for the choosen flavor
      // regarding is remaining quota
      self.getMaximumInstanceCreationCount = function getMaximumInstanceCreationCount() {
        const flavor = find(self.panelsData.flavors, {
          id: self.model.flavorId,
        });
        const quota = find(self.panelsData.quota, {
          region: self.model.region,
        });
        let max = 0;
        if (flavor && quota) {
          max = quota.instance.maxInstances - quota.instance.usedInstances;
          max = Math.min(
            max,
            Math.floor(
              (quota.instance.maxCores - quota.instance.usedCores) /
                flavor.vcpus,
            ),
          );
          max = Math.min(
            max,
            Math.floor(
              (quota.instance.maxRam - quota.instance.usedRAM) / flavor.ram,
            ),
          );
        }
        return max;
      };

      // ---

      self.fetchPublicNetworks = function fetchPublicNetworks() {
        if (self.loaders.publicNetwork.query) {
          return;
        }

        self.loaders.publicNetwork.query = true;

        OvhApiCloudProjectNetworkPublic.v6()
          .query({
            serviceName,
          })
          .$promise.then((networks) => {
            self.panelsData.publicNetworks = networks;
          })
          .catch((error) => {
            self.panelsData.publicNetworks = [];
            CucCloudMessage.error(
              $translate.instant(
                'cpcivm_addedit_advanced_options_public_network_query_error',
                {
                  message: JSON.stringify(error),
                },
              ),
            );
          })
          .finally(() => {
            self.loaders.publicNetwork.query = false;
          });
      };

      self.fetchPrivateNetworks = function fetchPrivateNetworks() {
        if (self.loaders.privateNetwork.query) {
          return;
        }

        self.loaders.privateNetwork.query = true;

        return OvhApiCloudProjectNetworkPrivate.v6()
          .query({
            serviceName,
          })
          .$promise.then((networks) => {
            self.panelsData.privateNetworks = networks;
            return self.fetchPrivateNetworksSubnets();
          })
          .catch((error) => {
            self.panelsData.privateNetworks = [];
            CucCloudMessage.error(
              $translate.instant(
                'cpcivm_addedit_advanced_options_private_network_query_error',
                {
                  message: JSON.stringify(error),
                },
              ),
            );
          })
          .finally(() => {
            self.loaders.privateNetwork.query = false;
          });
      };

      self.fetchPrivateNetworksSubnets = function fetchPrivateNetworksSubnets() {
        if (self.loaders.privateNetwork.subnet.query) {
          return;
        }

        if (!self.panelsData.privateNetworks) {
          return;
        }

        self.loaders.privateNetwork.subnet.query = true;

        let networkIds = []; /* used to store an intermediate chain state. */
        return thru(
          map(
            tap(map(self.panelsData.privateNetworks, property('id')), (ids) => {
              networkIds = ids;
            }),
            (networkId) =>
              OvhApiCloudProjectNetworkPrivateSubnet.v6().query({
                serviceName,
                networkId,
              }).$promise,
          ),
          (promises) => {
            /* .mapKeys on a more recent lodash. */
            const collection = {};
            forEach(promises, (promise, key) => {
              collection[networkIds[key]] = promise;
            });
            return $q.all(collection);
          },
        )
          .then((subnets) => {
            self.panelsData.subnets = subnets;
          })
          .catch((error) => {
            self.panelsData.subnets = [];
            CucCloudMessage.error(
              $translate.instant(
                'cpcivm_addedit_advanced_options_private_network_subnet_query_error',
                {
                  message: error.data.message || JSON.stringify(error),
                },
              ),
            );
          })
          .finally(() => {
            self.loaders.privateNetwork.subnet.query = false;
          });
      };

      self.getPrivateNetworks = function getPrivateNetworks() {
        const pad = Array(5).join('0');

        return map(
          sortBy(
            filter(self.panelsData.privateNetworks, (privateNetwork) => {
              if (!has(self.panelsData.subnets, privateNetwork.id)) {
                return false;
              }
              return some(privateNetwork.regions, 'region', self.model.region);
            }),
            'vlanId',
          ),
          (network) =>
            assign(network, {
              vlanId:
                pad.substring(
                  0,
                  pad.length - network.vlanId.toString().length,
                ) + network.vlanId,
            }),
        );
      };

      self.hasVrackSupport = function hasVrackSupport() {
        return self.states.hasVrack;
      };

      self.getVlansGuideUrl = function getVlansGuideUrl() {
        return self.urls.vlansGuide;
      };

      self.getVlansApiGuideUrl = function getVlansApiGuideUrl() {
        return self.urls.vlansApiGuide;
      };

      self.getVrackUrl = function getVrackUrl() {
        return self.urls.vrack;
      };

      self.getCreateSshKeysGuideUrl = function getCreateSshKeysGuideUrl() {
        return self.urls.guidesSshkeyURL;
      };

      // TODO : Delete this and the code in the .html once we remove the old catalog.
      //        Used to display the proper label text.
      self.catalogVersion = function catalogVersion() {
        let oldCatalog = some(self.panelsData.regions, (region) =>
          /GRA1|BHS1|SBG1/.test(region),
        );
        if (/(WAW)|(DE)|(UK)/.test(self.model.region)) {
          oldCatalog = false;
        }
        return oldCatalog ? 'old' : 'new';
      };

      /**
       * Check migration compatibility with Windows.
       * @param  {String}   VPS category.
       * @return {Boolean}  true if migration to this category of VPS is not possible
       *                    because of Windows.
       */
      self.hasWindowsCompatibilityIssue = function hasWindowsCompatibilityIssue(
        category,
      ) {
        return (
          self.vmInEdition.image &&
          self.vmInEdition.image.type === 'windows' &&
          category === 'vps'
        );
      };

      self.showFlex = function showFlex(category) {
        return includes(['balanced', 'cpu', 'ram'], category);
      };

      self.showCeph = function showCeph(category) {
        return (
          includes(['balanced', 'cpu', 'ram'], category) &&
          self.getFlavorOfCurrentRegionAndOSType(
            self.categoriesVmInEditionFlavor[category],
            'ceph',
            false,
          ) !== undefined
        );
      };
    },
  );
/* eslint-disable no-use-before-define, consistent-return */
