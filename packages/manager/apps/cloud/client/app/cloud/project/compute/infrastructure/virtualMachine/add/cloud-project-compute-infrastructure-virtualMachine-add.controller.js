import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';

class CloudProjectComputeInfrastructureVirtualMachineAddCtrl {
  constructor(
    $q,
    $state,
    $stateParams,
    atInternet,
    CloudFlavorService,
    CloudImageService,
    CloudProjectVirtualMachineAddService,
    CloudRegionService,
    CucControllerHelper,
    CucPriceHelper,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectImage,
    OvhApiCloudProjectInstance,
    OvhApiCloudProjectNetworkPrivate,
    OvhApiCloudProjectNetworkPublic,
    OvhApiCloudProjectQuota,
    OvhApiCloudProjectRegion,
    OvhApiCloudProjectSnapshot,
    OvhApiCloudProjectSshKey,
    CucCurrencyService,
    CucRegionService,
    CucServiceHelper,
    ovhDocUrl,
    coreConfig,
    URLS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.atInternet = atInternet;
    this.CloudFlavorService = CloudFlavorService;
    this.CloudImageService = CloudImageService;
    this.CloudRegionService = CloudRegionService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucPriceHelper = CucPriceHelper;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.OvhApiCloudProjectNetworkPrivate = OvhApiCloudProjectNetworkPrivate;
    this.OvhApiCloudProjectNetworkPublic = OvhApiCloudProjectNetworkPublic;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
    this.OvhApiCloudProjectSnapshot = OvhApiCloudProjectSnapshot;
    this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;
    this.CucCurrencyService = CucCurrencyService;
    this.CucRegionService = CucRegionService;
    this.CucServiceHelper = CucServiceHelper;
    this.VirtualMachineAddService = CloudProjectVirtualMachineAddService;
    this.ovhDocUrl = ovhDocUrl;
    this.coreConfig = coreConfig;
    this.URLS = URLS;
  }

  $onInit() {
    this.serviceName = this.$stateParams.projectId;
    this.currentCurrency = this.CucCurrencyService.getCurrentCurrency();
    this.loaders = {
      adding: false,
    };
    this.model = {
      billingPeriod: null,
      flavor: null,
      imageType: null,
      name: '',
      networkId: '',
      number: 0,
      region: null,
      sshKey: null,
      userData: null,
    };
    this.enums = {
      billingPeriods: ['monthly', 'hourly'],
      flavorsTypes: [],
      imagesTypes: [],
    };
    this.isNameUpdated = false;
    this.isPostScriptEnabled = false;
    this.mostRecentVm = null;
    this.newSshKey = {
      name: null,
      publicKey: null,
    };
    this.state = {
      hasVRack: false,
    };
    this.submitted = {};
    this.urls = {};
  }

  initProject() {
    this.promiseQuota = this.OvhApiCloudProjectQuota.v6().query({
      serviceName: this.serviceName,
    }).$promise;
    this.promisePublicNetworks = this.OvhApiCloudProjectNetworkPublic.v6().query(
      { serviceName: this.serviceName },
    ).$promise;
    this.urls.vLansApiGuide = this.ovhDocUrl.getDocUrl(
      'g2162.public_cloud_et_vrack_-_comment_utiliser_le_vrack_et_les_reseaux_prives_avec_les_instances_public_cloud',
    );
    if (this.coreConfig.getRegion() === 'US') {
      this.urls.guidesSshkey = this.URLS.guides.ssh.create.US;
    } else {
      this.urls.guidesSshkey = this.ovhDocUrl.getDocUrl(
        'g1769.creating_ssh_keys',
      );
    }

    this.initOsList();
  }

  cancel() {
    this.$state.go('iaas.pci-project.compute.infrastructure.list');
  }

  confirm() {
    this.addVirtualMachine();
  }

  /*----------------------------------
     |  Step 1 : OS or SnapShot choice  |
     ----------------------------------*/

  initOsList() {
    this.loaders.step1 = true;
    return this.$q
      .all({
        images: this.OvhApiCloudProjectImage.v6()
          .query({ serviceName: this.serviceName })
          .$promise.then((images) => {
            // Image types (linux, windows, ...)
            this.enums.imagesTypes = this.CloudImageService.constructor.getImageTypes(
              images,
            );
            this.images = this.VirtualMachineAddService.getAugmentedImages(
              images,
            );
          })
          .catch(
            this.CucServiceHelper.errorHandler('cpcivm_add_step1_images_ERROR'),
          ),
        snapshots: this.OvhApiCloudProjectSnapshot.v6()
          .query({ serviceName: this.serviceName })
          .$promise.then((snapshots) => {
            this.snapshots = map(snapshots, (snapshot) =>
              set(snapshot, 'distribution', get(snapshot, 'type', 'linux')),
            );
          })
          .catch(
            this.CucServiceHelper.errorHandler(
              'cpcivm_add_step1_shapshots_ERROR',
            ),
          ),
        sshKeys: this.OvhApiCloudProjectSshKey.v6().query({
          serviceName: this.serviceName,
        }).$promise,
        instances: this.OvhApiCloudProjectInstance.v6().query({
          serviceName: this.serviceName,
        }).$promise,
      })
      .then(({ sshKeys, instances }) => {
        this.displayedSnapshots = filter(this.snapshots, { status: 'active' });
        this.displayedImages = this.CloudImageService.groupImagesByType(
          this.images,
          this.enums.imagesTypes,
        );
        this.displayedApps = this.VirtualMachineAddService.getImageApps(
          this.images,
        );
        this.displayedSshKeys = sshKeys;

        this.mostRecentVm = this.VirtualMachineAddService.constructor.getMostRecentVm(
          instances,
        );
        if (this.mostRecentVm) {
          this.model.sshKey = find(sshKeys, { id: this.mostRecentVm.sshKeyId });
        }
      })
      .catch(
        this.CucServiceHelper.errorHandler('cpcivm_add_step1_general_ERROR'),
      )
      .finally(() => {
        this.loaders.step1 = false;
      });
  }

  onSelectChange() {
    if (get(this.model, 'imageType.type') === 'windows') {
      this.addingSshKey = false;
    }
  }

  isStep1Valid() {
    return (
      this.model.imageType &&
      !this.addingSshKey &&
      (this.model.imageType.type !== 'linux' || this.model.sshKey)
    );
  }

  resetStep1() {
    this.submitted.step1 = false;
    this.resetStep2();
  }

  addSshKey() {
    if (this.newSshKey.name && this.newSshKey.publicKey) {
      this.loaders.addingSsh = true;
      return this.OvhApiCloudProjectSshKey.v6()
        .save({ serviceName: this.serviceName }, this.newSshKey)
        .$promise.then((newSshKey) => {
          this.OvhApiCloudProjectSshKey.v6().resetQueryCache();
          return this.$q.all({
            newSshKey,
            sshKeys: this.OvhApiCloudProjectSshKey.v6().query({
              serviceName: this.serviceName,
            }).$promise,
          });
        })
        .then(({ newSshKey, sshKeys }) => {
          this.displayedSshKeys = sshKeys;
          this.model.sshKey = newSshKey;
          this.checkSshKeyByRegion(newSshKey.regions);
        })
        .catch(
          this.CucServiceHelper.errorHandler(
            'cpcivm_add_step1_sshKey_adding_ERROR',
          ),
        )
        .finally(() => {
          this.resetAddingSshKey();
          this.loaders.addingSsh = false;
        });
    }
    return false;
  }

  resetAddingSshKey() {
    this.model.sshKey = null;
    this.newSshKey.name = null;
    this.newSshKey.publicKey = null;
    this.addingSshKey = false;
  }

  /*-----------------------------------------
     |  Step 2 : Region and DataCenter choice  |
     -----------------------------------------*/

  initRegionsAndDataCenters() {
    this.loaders.step2 = true;
    this.submitted.step2 = false;
    this.resetStep3();

    return this.$q
      .all({
        regions: this.OvhApiCloudProjectRegion.v6()
          .query({ serviceName: this.serviceName })
          .$promise.then((regions) => {
            this.regions = map(regions, (region) =>
              this.CucRegionService.getRegion(region),
            );
            return this.VirtualMachineAddService.getRegionsByImageType(
              this.regions,
              this.images,
              get(this.model, 'imageType'),
            );
          }),
        availableRegions: this.fetchAvailableRegions(),
        quota: this.promiseQuota
          .then((quota) => {
            this.quota = quota;
          })
          .catch(
            this.CucServiceHelper.errorHandler('cpcivm_add_step2_quota_ERROR'),
          ),
      })
      .then(({ regions, availableRegions }) => {
        const allRegions = regions.concat(availableRegions);
        forEach(allRegions, (region) => {
          // Add quota info
          this.CloudRegionService.constructor.addOverQuotaInfos(
            region,
            this.quota,
          );
          // Check SSH Key opportunity
          if (get(this.model, 'sshKey.regions', false)) {
            this.CloudRegionService.constructor.checkSshKey(
              region,
              this.model.sshKey.regions,
            );
          }
          // check region active/inactive
          const isRegionActive = this.CloudRegionService.constructor.isActive(
            region,
          );
          if (!isRegionActive) {
            this.CloudRegionService.constructor.setRegionInactiveMessage(
              region,
            );
          }
        });
        this.displayedRegions = this.VirtualMachineAddService.constructor.groupRegionsByDatacenter(
          allRegions,
        );
        this.groupedRegions = groupBy(this.displayedRegions, 'continent');
      })
      .catch(
        this.CucServiceHelper.errorHandler('cpcivm_add_step2_regions_ERROR'),
      )
      .finally(() => {
        this.loaders.step2 = false;
      });
  }

  fetchAvailableRegions() {
    this.availableRegions = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.OvhApiCloudProjectRegion.AvailableRegions()
          .v6()
          .query({ serviceName: this.serviceName })
          .$promise.then((regionIds) =>
            map(regionIds, (region) => {
              const regionDetails = this.CucRegionService.getRegion(
                region.name,
              );
              set(regionDetails, 'notAvailable', true);
              return regionDetails;
            }),
          )
          .catch((error) =>
            this.CucServiceHelper.errorHandler(
              'cpci_add_regions_get_available_regions_error',
            )(error),
          ),
    });
    return this.availableRegions.load();
  }

  isStep2Valid() {
    return this.model.region && this.model.imageId;
  }

  resetStep2() {
    this.submitted.step2 = false;
    this.model.region = null;
    this.resetStep3();
  }

  setImageId() {
    if (this.CloudImageService.constructor.isSnapshot(this.model.imageType)) {
      this.model.imageId = this.model.imageType;
    } else {
      this.model.imageId = find(this.images, {
        apps: get(this.model, 'imageType.apps', false),
        distribution: this.model.imageType.distribution,
        nameGeneric: this.model.imageType.nameGeneric,
        region: this.model.region.microRegion.code,
        status: 'active',
        type: get(this.model, 'imageType.type', 'linux'),
      });
    }
  }

  checkSshKeyByRegion(sshKeyRegions) {
    forEach(this.displayedRegions, (region) => {
      forEach(region.dataCenters, (dataCenter) => {
        this.CloudRegionService.constructor.checkSshKey(
          dataCenter,
          sshKeyRegions,
        );
      });
    });
  }

  updateSshKeyRegion() {
    return this.VirtualMachineAddService.openSshKeyRegionModal(
      this.model.sshKey,
    )
      .then(() => {
        this.loaders.step2 = true;
        return this.OvhApiCloudProjectSshKey.v6().remove({
          serviceName: this.serviceName,
          keyId: this.model.sshKey.id,
        }).$promise;
      })
      .then(
        () =>
          this.OvhApiCloudProjectSshKey.v6().save(
            { serviceName: this.serviceName },
            {
              name: this.model.sshKey.name,
              publicKey: this.model.sshKey.publicKey,
            },
          ).$promise,
      )
      .then((sshKey) => {
        this.model.sshKey = sshKey;
        set(
          find(this.displayedSshKeys, { id: sshKey.id }),
          'regions',
          sshKey.regions,
        );
        this.checkSshKeyByRegion(sshKey.regions);
      })
      .finally(() => {
        this.loaders.step2 = false;
      });
  }

  /*---------------------
     |  Step 3: Instances  |
     ---------------------*/

  fetchingAugmentedFlavors() {
    return this.OvhApiCloudProjectFlavor.v6()
      .query({
        serviceName: this.serviceName,
        region: this.model.region.microRegion.code,
      })
      .$promise.then((flavors) => {
        this.flavors = flavors;
        const augmentedFlavors = this.VirtualMachineAddService.filterFlavorsByType(
          flavors,
          this.model.imageType.type,
        );
        this.enums.flavorsTypes = this.CloudFlavorService.constructor.getFlavorTypes(
          augmentedFlavors,
        );
        return augmentedFlavors;
      });
  }

  initInstances() {
    this.loaders.step3 = true;
    this.submitted.step3 = false;
    this.resetStep4();

    return this.$q
      .all({
        flavors: this.fetchingAugmentedFlavors(),
        hasVRack: this.VirtualMachineAddService.hasVRack(this.serviceName),
        prices: this.CucPriceHelper.getPrices(this.serviceName),
      })
      .then(({ flavors, hasVRack, prices }) => {
        this.prices = prices;
        this.state.hasVRack = hasVRack;

        // Load private networks asynchronously
        if (hasVRack) {
          this.getPrivateNetworks();
        }

        // Add price and quota info to each instance type
        forEach(flavors, (flavor) => {
          this.CloudFlavorService.constructor.addPriceInfos(
            flavor,
            this.prices,
          );
          this.CloudFlavorService.constructor.addOverQuotaInfos(
            flavor,
            this.quota,
            get(this.model, 'imageId.minDisk', 0),
            get(this.model, 'imageId.minRam', 0),
          );
        });

        // Remove flavor without price (not in the catalog)
        remove(flavors, (flavor) =>
          isEmpty(get(flavor, 'price.price.text', '')),
        );

        let filteredFlavors = this.VirtualMachineAddService.constructor.getFilteredFlavorsByRegion(
          flavors,
          this.model.region.microRegion.code,
        );

        // Remove flavors if OS has restricted
        const restrictedFlavors = get(this.model, 'imageId.flavorType') || [];
        if (restrictedFlavors.length > 0) {
          filteredFlavors = filter(
            filteredFlavors,
            (flavor) => indexOf(restrictedFlavors, flavor.shortType) > -1,
          );
        }

        // Remove incompatible flavors with selected image
        filteredFlavors = filter(filteredFlavors, (flavor) => {
          const restrictedImages = get(flavor, 'imageType', false);
          return (
            restrictedImages === false ||
            some(restrictedImages, (name) =>
              new RegExp(name, 'gi').test(this.model.imageType.name),
            )
          );
        });

        this.groupedFlavors = this.VirtualMachineAddService.groupFlavorsByCategory(
          filteredFlavors,
          this.enums.flavorsTypes,
        );
      })
      .catch(
        this.CucServiceHelper.errorHandler('cpcivm_add_step3_flavors_ERROR'),
      )
      .finally(() => {
        this.loaders.step3 = false;
      });
  }

  isStep3Valid() {
    return this.model.flavor != null;
  }

  resetStep3() {
    this.model.flavor = null;
    this.submitted.step3 = false;
    this.resetStep4();
  }

  /*--------------------------
     |  Step 4: Instance config |
     --------------------------*/

  initInstanceConfiguration() {
    this.loaders.step4 = true;
    this.submitted.step4 = false;
    // Set instance creation number to 1 and name
    this.model.number = 1;
    this.setInstanceName();

    return this.promisePublicNetworks
      .then((publicNetworks) => {
        this.publicNetworks = publicNetworks;
      })
      .catch(() => {
        this.publicNetworks = [];
      })
      .finally(() => {
        this.loaders.step4 = false;
      });
  }

  isStep4Valid() {
    return (
      !isEmpty(this.model.name) &&
      this.model.number > 0 &&
      (!this.state.hasVRack || !isEmpty(this.model.networkId))
    );
  }

  resetStep4() {
    this.model.network = null;
    this.model.number = 1;
    if (!this.isNameUpdated) {
      this.model.name = '';
    }
    this.submitted.step4 = false;
    this.resetStep5();
  }

  enablePostScript() {
    this.isPostScriptEnabled = true;
  }

  getPrivateNetworks() {
    this.loaders.privateNetworks = true;
    return this.OvhApiCloudProjectNetworkPrivate.v6()
      .query({ serviceName: this.serviceName })
      .$promise.then((networks) => {
        this.privateNetworks = networks;
        return this.VirtualMachineAddService.getPrivateNetworksSubNets(
          this.serviceName,
          this.privateNetworks,
        );
      })
      .then((subNets) => {
        this.displayedPrivateNetworks = this.VirtualMachineAddService.constructor.getFilteredPrivateNetworksByRegion(
          this.privateNetworks,
          this.model.region.microRegion.code,
          subNets,
        );
      })
      .catch(() => {
        this.displayedPrivateNetworks = [];
      })
      .finally(() => {
        this.loaders.privateNetworks = false;
      });
  }

  setInstanceName() {
    if (isEmpty(this.model.name) || !this.isNameUpdated) {
      this.model.name = `${get(this.model, 'flavor.name', '')}-${get(
        this.model,
        'region.microRegion.code',
        '',
      )}`.toLowerCase();
    }
  }

  /*--------------------------
     |  Step 5: Billing period  |
     --------------------------*/

  initBillingPeriod() {
    this.resetStep5();
  }

  isStep5Valid() {
    return (
      isString(this.model.billingPeriod) && !isEmpty(this.model.billingPeriod)
    );
  }

  resetStep5() {
    this.model.billingPeriod = null;
    this.submitted.step5 = false;
  }

  /*-------------------
     |  Submit the form  |
     -------------------*/

  addVirtualMachine() {
    this.loaders.adding = true;
    this.submitted.step4 = true;

    if (!isEmpty(this.model.networkId) && this.model.networkId !== 'none') {
      this.model.networks = [
        { networkId: this.model.networkId },
        { networkId: head(this.publicNetworks).id },
      ];
    }

    return this.VirtualMachineAddService.createVirtualMachine(
      this.serviceName,
      this.model,
    )
      .then(() => {
        this.$state.go('iaas.pci-project.compute.infrastructure.list');
      })
      .catch(this.CucServiceHelper.errorHandler('cpcivm_add_launch_ERROR'))
      .catch(() => {
        this.submitted.step4 = false;
        this.loaders.adding = false;
      });
  }

  submitStep(step, tag) {
    this.submitted[step] = true;
    this.atInternet.trackClick({
      name: tag,
      type: 'action',
    });
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureVirtualMachineAddCtrl',
    CloudProjectComputeInfrastructureVirtualMachineAddCtrl,
  );
