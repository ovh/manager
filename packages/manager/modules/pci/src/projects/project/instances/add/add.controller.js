import find from 'lodash/find';
import has from 'lodash/has';
import map from 'lodash/map';

import Quota from '../../../../components/project/instance/quota/quota.class';
import Datacenter from './regions-list/datacenter.class';

export default class CloudProjectComputeInfrastructureVirtualMachineAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    //     $state,
    //     $stateParams,
    $translate,
    // atInternet,
    //     CucFlavorService,
    //     CloudImageService,
    //     CloudProjectVirtualMachineAddService,
    //     CloudRegionService,
    //     CucPriceHelper,
    //     OvhApiCloudProjectFlavor,
    //     OvhApiCloudProjectImage,
    CucCloudMessage,
    CucRegionService,
    OvhApiCloudProjectInstance,
    OvhApiCloudProjectRegion,
    //     OvhApiCloudProjectNetworkPrivate,
    //     OvhApiCloudProjectNetworkPublic,
    PciProjectRegions,
    //     OvhApiCloudProjectSnapshot,
    //     OvhApiCloudProjectSshKey,
    //     CucCurrencyService,
    //     CucServiceHelper,
    //     ovhDocUrl,
    //     coreConfig,
    //     PCI_URLS,
  ) {
    this.$q = $q;
    //     this.$state = $state;
    //     this.$stateParams = $stateParams;
    this.$translate = $translate;
    // this.atInternet = atInternet;
    //     this.CucFlavorService = CucFlavorService;
    //     this.CloudImageService = CloudImageService;
    //     this.CucPriceHelper = CucPriceHelper;
    //     this.CloudRegionService = CloudRegionService;
    //     this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    //     this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
    //     this.OvhApiCloudProjectNetworkPrivate = OvhApiCloudProjectNetworkPrivate;
    //     this.OvhApiCloudProjectNetworkPublic = OvhApiCloudProjectNetworkPublic;
    this.PciProjectRegions = PciProjectRegions;
    //     this.OvhApiCloudProjectSnapshot = OvhApiCloudProjectSnapshot;
    //     this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;
    //     this.CucCurrencyService = CucCurrencyService;
    //     this.CucServiceHelper = CucServiceHelper;
    //     this.VirtualMachineAddService = CloudProjectVirtualMachineAddService;
    //     this.ovhDocUrl = ovhDocUrl;
    //     this.region = coreConfig.getRegion();
    //     this.PCI_URLS = PCI_URLS[this.region];
  }

  $onInit() {
    this.loaders = {
      areRegionsLoading: false,
      isSubmitting: false,
    };

    this.regions = [];
    this.quota = null;
    this.flavor = null;
    this.onlyDisplaySelectedRegion = false;

    this.loadMessages();
    // this.serviceName = this.$stateParams.projectId;
    // this.currentCurrency = this.CucCurrencyService.getCurrentCurrency();

    this.model = {
    //   billingPeriod: null,
      flavorGroup: null,
      image: null,
      //   name: '',
      //   networkId: '',
      monthlyBilling: true,
      number: 1,
      location: null,
      datacenter: null,
      sshKey: null,
    //   userData: null,
    };

    this.submitted = {
      flavor: false,
      region: false,
    };
    // this.enums = {
    //   billingPeriods: ['monthly', 'hourly'],
    //   flavorsTypes: [],
    //   imagesTypes: [],
    // };
    // this.isNameUpdated = false;
    // this.isPostScriptEnabled = false;
    // this.mostRecentVm = null;
    // this.newSshKey = {
    //   name: null,
    //   publicKey: null,
    // };
    // this.state = {
    //   hasVRack: false,
    // };
    // this.submitted = {};
    // this.PCI_URLS = {};
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.instances.new');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.instances.new', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getRegions() {
    this.loaders.areRegionsLoading = true;
    return this.$q.all({
      availableRegions: this.OvhApiCloudProjectRegion
        .AvailableRegions().v6().query({ serviceName: this.projectId }).$promise,
      regions: this.PciProjectRegions.getRegions(this.projectId),
    })
      .then(({ availableRegions, regions }) => {
        this.regions = this.PciProjectRegions.groupByContinentAndDatacenterLocation(
          map([...regions, ...availableRegions], region => new Datacenter({
            ...region,
            ...this.CucRegionService.getRegion(region.name),
            available: has(region, 'status'),
          })),
        );
      })
      .finally(() => {
        this.loaders.areRegionsLoading = false;
      });
  }

  isRegionAvailable(datacenter) {
    return this.model.flavorGroup.isAvailableInRegion(datacenter.name)
      && datacenter.isAvailable()
      && datacenter.hasEnoughQuota();
  }

  createQuota() {
    this.quota = new Quota(this.model.datacenter.quota.instance);
  }

  setFlavor() {
    console.log(this.model.image);
    this.flavor = find(this.model.flavorGroup.flavors, { osType: this.model.image.type });
  }

  //   initProject() {
  //     this.promiseQuota = this.OvhApiCloudProjectQuota.v6()
  //       .query({ serviceName: this.serviceName }).$promise;
  //     this.promisePublicNetworks = this.OvhApiCloudProjectNetworkPublic.v6()
  //       .query({ serviceName: this.serviceName }).$promise;
  //     this.PCI_URLS.vLansApiGuide = this.ovhDocUrl.getDocUrl
  // ('g2162.public_cloud_et_vrack_-_comment_utiliser_le_vrack_et_les_reseaux_prives_avec_les_instances_public_cloud');
  //     if (this.region === 'US') {
  //       this.PCI_URLS.guidesSshkey = this.PCI_URLS.guides.ssh.create.US;
  //     } else {
  //       this.PCI_URLS.guidesSshkey = this.ovhDocUrl.getDocUrl('g1769.creating_ssh_keys');
  //     }

  //     this.initOsList();
  //   }

  //   cancel() {
  //     this.$state.go('pci.projects.project.instances');
  //   }

  //   confirm() {
  //     this.addVirtualMachine();
  //   }

  // initRegions() {
  //   this.loaders.areRegionsLoading = true;
  //   // this.submitted.step2 = false;
  //   // this.resetStep3();

  //   // return this.PciProjectRegions.getAvailableRegions(this.projectId)
  //   //   .then((regions) => {
  //   //     this.regions = regions.map(region => new InstanceRegion(region));
  //   //   })
  //   //   // return;
  //     // this.VirtualMachineAddService
  //     // .getRegionsByImageType(this.regions, this.images, get(this.model, 'imageType'));
  //   //   quota: this.promiseQuota
  //   //     .then((quota) => { this.quota = quota; })
  //   //     .catch(this.CucServiceHelper.errorHandler('cpcivm_add_step2_quota_ERROR')),
  //   // })
  //   //   .then(({ regions }) => {
  //   //     forEach(regions, (region) => {
  //   //       // Add quota info
  //   //       this.CloudRegionService.constructor.addOverQuotaInfos(region, this.quota);

  //   //       // Check SSH Key opportunity
  //   //       if (get(this.model, 'sshKey.regions', false)) {
  //   //         this.CloudRegionService.constructor.checkSshKey(region, this.model.sshKey.regions);
  //   //       }
  //   //     });

  //   //     this.displayedRegions = this.VirtualMachineAddService.constructor
  //   //       .groupRegionsByDatacenter(regions);
  //   //     this.groupedRegions = groupBy(this.displayedRegions, 'continent');
  //   //   })
  //     .catch(() => {
  //       this.CucCloudMessage.error(
  //         this.$translate.instant('pci_project_instances_new_regions_error'),
  //       );
  //     })
  //     .finally(() => {
  //       this.loaders.areRegionsLoading = false;
  //     });
  // }

  create() {
    this.loaders.isSubmitting = true;

    // if (!isEmpty(this.model.networkId) && this.model.networkId !== 'none') {
    //   this.model.networks = [
    //     { networkId: this.model.networkId },
    //     { networkId: head(this.publicNetworks).id },
    //   ];
    // }

    return this.OvhApiCloudProjectInstance.v6().bulk({
      serviceName: this.projectId,
    }, {
      flavorId: this.model.flavorGroup.flavors.find(flavor => flavor.osType === 'linux').id,
    }).$promise
      .catch(error => console.log(error))
      .finally(() => {
        this.loaders.isSubmitting = false;
      });
  }

  // submitStep(tag) {
  //   this.atInternet.trackClick({
  //     name: tag,
  //     type: 'action',
  //   });
  // }

  // initInstances() {
  //   this.loaders.areInstancesLoading = true;
  //   // this.loaders.step3 = true;
  //   // this.submitted.step3 = false;
  //   // this.resetStep4();

  //   return this.$q.all({
  //     flavors: this.fetchingAugmentedFlavors(),
  //     hasVRack: this.VirtualMachineAddService.hasVRack(this.serviceName),
  //     prices: this.CucPriceHelper.getPrices(this.serviceName),
  //   })
  //     .then(({ flavors, hasVRack, prices }) => {
  //       this.prices = prices;
  //       this.state.hasVRack = hasVRack;

  //       // Load private networks asynchronously
  //       if (hasVRack) {
  //         this.getPrivateNetworks();
  //       }

  //       // Add price and quota info to each instance type
  //       forEach(flavors, (flavor) => {
  //         this.CucFlavorService.constructor.addPriceInfos(flavor, this.prices);
  //         this.CucFlavorService.constructor
  //           .addOverQuotaInfos(flavor, this.quota, get(this.model, 'imageId.minDisk', 0), get(this.model, 'imageId.minRam', 0));
  //       });

  //       // Remove flavor without price (not in the catalog)
  //       remove(flavors, flavor => isEmpty(get(flavor, 'price.price.text', '')));

  //       let filteredFlavors = this.VirtualMachineAddService.constructor.getFilteredFlavorsByRegion(
  //         flavors,
  //         this.model.region.microRegion.code,
  //       );

  //       // Remove flavors if OS has restricted
  //       const restrictedFlavors = get(this.model, 'imageId.flavorType') || [];
  //       if (restrictedFlavors.length > 0) {
  //         filteredFlavors = filter(
  //           filteredFlavors,
  //           flavor => indexOf(restrictedFlavors, flavor.shortType) > -1,
  //         );
  //       }

  //       // Remove incompatible flavors with selected image
  //       filteredFlavors = filter(filteredFlavors, (flavor) => {
  //         const restrictedImages = get(flavor, 'imageType', false);
  //         return restrictedImages === false || some(restrictedImages, name => (new RegExp(name, 'gi')).test(this.model.imageType.name));
  //       });

  //       this.groupedFlavors = this.VirtualMachineAddService.groupFlavorsByCategory(
  //         filteredFlavors,
  //         this.enums.flavorsTypes,
  //       );
  //     })
  //     .catch(this.CucServiceHelper.errorHandler('cpcivm_add_step3_flavors_ERROR'))
  //     .finally(() => {
  //       this.loaders.step3 = false;
  //     });
  // }

  // fetchingAugmentedFlavors() {
  //   return this.OvhApiCloudProjectFlavor.v6()
  //     .query({
  //       serviceName: this.serviceName,
  //       region: this.model.region.microRegion.code,
  //     }).$promise
  //     .then((flavors) => {
  //       this.flavors = flavors;
  //       const augmentedFlavors = this.VirtualMachineAddService.filterFlavorsByType(
  //         flavors,
  //         this.model.imageType.type,
  //       );
  //       this.enums.flavorsTypes = this.CucFlavorService.constructor
  //         .getFlavorTypes(augmentedFlavors);
  //       return augmentedFlavors;
  //     });
  // }

  //   /*----------------------------------
  //      |  Step 1 : OS or SnapShot choice  |
  //      ----------------------------------*/

  // initOsList() {
  //   this.loaders.step1 = true;
  //   return this.$q.all({
  //     images:
  // this.OvhApiCloudProjectImage.v6().query({ serviceName: this.serviceName }).$promise
  //   .then((images) => {
  //     // Image types (linux, windows, ...)
  //     this.enums.imagesTypes = this.CloudImageService.constructor.getImageTypes(images);
  //     this.images = this.VirtualMachineAddService.getAugmentedImages(images);
  //   })
  //   .catch(this.CucServiceHelper.errorHandler('cpcivm_add_step1_images_ERROR')),
  //     snapshots: this.OvhApiCloudProjectSnapshot.v6()
  //       .query({ serviceName: this.serviceName }).$promise
  //       .then((snapshots) => {
  //         this.snapshots =  map(snapshots, snapshot => set(snapshot, 'distribution', get(snapshot, 'type', 'linux')));
  //       })
  //       .catch(this.CucServiceHelper.errorHandler('cpcivm_add_step1_shapshots_ERROR')),
  //     sshKeys:
  // this.OvhApiCloudProjectSshKey.v6().query({ serviceName: this.serviceName }).$promise,
  //     instances: this.OvhApiCloudProjectInstance.v6()
  //       .query({ serviceName: this.serviceName }).$promise,
  //   })
  //     .then(({ sshKeys, instances }) => {
  //       this.displayedSnapshots = filter(this.snagit pshots, { status: 'active' });
  //       this.displayedImages = this.CloudImageService.groupImagesByType(
  //         this.images,
  //         this.enums.imagesTypes,
  //       );
  //       this.displayedApps = this.VirtualMachineAddService.getImageApps(this.images);
  //       this.displayedSshKeys = sshKeys;

  //       this.mostRecentVm =  this.VirtualMachineAddService.constructor.getMostRecentVm(instances);
  //       if (this.mostRecentVm) {
  //         this.model.sshKey = find(sshKeys, { id: this.mostRecentVm.sshKeyId });
  //       }
  //     })
  //     .catch(this.CucServiceHelper.errorHandler('cpcivm_add_step1_general_ERROR'))
  //     .finally(() => {
  //       this.loaders.step1 = false;
  //     });
  // }

  //   onSelectChange() {
  //     if (get(this.model, 'imageType.type') === 'windows') {
  //       this.addingSshKey = false;
  //     }
  //   }

  //   isStep1Valid() {
  //     return
  // this.model.imageType &&
  // !this.addingSshKey && (this.model.imageType.type !== 'linux' || this.model.sshKey);
  //   }

  //   resetStep1() {
  //     this.submitted.step1 = false;
  //     this.resetStep2();
  //   }

  //   addSshKey() {
  //     if (this.newSshKey.name && this.newSshKey.publicKey) {
  //       this.loaders.addingSsh = true;
  //       return this.OvhApiCloudProjectSshKey.v6()
  //         .save({ serviceName: this.serviceName }, this.newSshKey).$promise
  //         .then((newSshKey) => {
  //           this.OvhApiCloudProjectSshKey.v6().resetQueryCache();
  //           return this.$q.all({
  //             newSshKey,
  //             sshKeys: this.OvhApiCloudProjectSshKey.v6()
  //               .query({ serviceName: this.serviceName }).$promise,
  //           });
  //         })
  //         .then(({ newSshKey, sshKeys }) => {
  //           this.displayedSshKeys = sshKeys;
  //           this.model.sshKey = newSshKey;
  //           this.checkSshKeyByRegion(newSshKey.regions);
  //         })
  //         .catch(this.CucServiceHelper.errorHandler('cpcivm_add_step1_sshKey_adding_ERROR'))
  //         .finally(() => {
  //           this.resetAddingSshKey();
  //           this.loaders.addingSsh = false;
  //         });
  //     }
  //     return false;
  //   }

  //   resetAddingSshKey() {
  //     this.model.sshKey = null;
  //     this.newSshKey.name = null;
  //     this.newSshKey.publicKey = null;
  //     this.addingSshKey = false;
  //   }

  //   /*-----------------------------------------
  //      |  Step 2 : Region and DataCenter choice  |
  //      -----------------------------------------*/


  //   isStep2Valid() {
  //     return this.model.region && this.model.imageId;
  //   }

  //   resetStep2() {
  //     this.submitted.step2 = false;
  //     this.model.region = null;
  //     this.resetStep3();
  //   }

  //   setImageId() {
  //     if (this.CloudImageService.constructor.isSnapshot(this.model.imageType)) {
  //       this.model.imageId = this.model.imageType;
  //     } else {
  //       this.model.imageId = find(this.images, {
  //         apps: get(this.model, 'imageType.apps', false),
  //         distribution: this.model.imageType.distribution,
  //         nameGeneric: this.model.imageType.nameGeneric,
  //         region: this.model.region.microRegion.code,
  //         status: 'active',
  //         type: get(this.model, 'imageType.type', 'linux'),
  //       });
  //     }
  //   }

  //   checkSshKeyByRegion(sshKeyRegions) {
  //     forEach(this.displayedRegions, (region) => {
  //       forEach(region.dataCenters, (dataCenter) => {
  //         this.CloudRegionService.constructor.checkSshKey(dataCenter, sshKeyRegions);
  //       });
  //     });
  //   }

  //   updateSshKeyRegion() {
  //     return this.VirtualMachineAddService.openSshKeyRegionModal(this.model.sshKey)
  //       .then(() => {
  //         this.loaders.step2 = true;
  //         return this.OvhApiCloudProjectSshKey.v6().remove({
  //           serviceName: this.serviceName,
  //           keyId: this.model.sshKey.id,
  //         }).$promise;
  //       })
  //       .then(() => this.OvhApiCloudProjectSshKey.v6().save({ serviceName: this.serviceName }, {
  //         name: this.model.sshKey.name,
  //         publicKey: this.model.sshKey.publicKey,
  //       }).$promise)
  //       .then((sshKey) => {
  //         this.model.sshKey = sshKey;
  //         set(find(this.displayedSshKeys, { id: sshKey.id }), 'regions', sshKey.regions);
  //         this.checkSshKeyByRegion(sshKey.regions);
  //       })
  //       .finally(() => {
  //         this.loaders.step2 = false;
  //       });
  //   }

  //   /*---------------------
  //      |  Step 3: Instances  |
  //      ---------------------*/


  //   isStep3Valid() {
  //     return this.model.flavor != null;
  //   }

  //   resetStep3() {
  //     this.model.flavor = null;
  //     this.submitted.step3 = false;
  //     this.resetStep4();
  //   }

  //   /*--------------------------
  //      |  Step 4: Instance config |
  //      --------------------------*/

  //   initInstanceConfiguration() {
  //     this.loaders.step4 = true;
  //     this.submitted.step4 = false;
  //     // Set instance creation number to 1 and name
  //     this.model.number = 1;
  //     this.setInstanceName();

  //     return this.promisePublicNetworks
  //       .then((publicNetworks) => { this.publicNetworks = publicNetworks; })
  //       .catch(() => { this.publicNetworks = []; })
  //       .finally(() => {
  //         this.loaders.step4 = false;
  //       });
  //   }

  //   isStep4Valid() {
  //     return !isEmpty(this.model.name)
  //       && this.model.number > 0
  //       && (!this.state.hasVRack || !isEmpty(this.model.networkId));
  //   }

  //   resetStep4() {
  //     this.model.network = null;
  //     this.model.number = 1;
  //     if (!this.isNameUpdated) {
  //       this.model.name = '';
  //     }
  //     this.submitted.step4 = false;
  //     this.resetStep5();
  //   }

  //   enablePostScript() {
  //     this.isPostScriptEnabled = true;
  //   }

  //   getPrivateNetworks() {
  //     this.loaders.privateNetworks = true;
  //     return this.OvhApiCloudProjectNetworkPrivate.v6()
  //       .query({ serviceName: this.serviceName }).$promise
  //       .then((networks) => {
  //         this.privateNetworks = networks;
  //         return this.VirtualMachineAddService.getPrivateNetworksSubNets(
  //           this.serviceName,
  //           this.privateNetworks,
  //         );
  //       }).then((subNets) => {
  //         this.displayedPrivateNetworks = this.VirtualMachineAddService.constructor
  //           .getFilteredPrivateNetworksByRegion(
  //             this.privateNetworks,
  //             this.model.region.microRegion.code,
  //             subNets,
  //           );
  //       }).catch(() => {
  //         this.displayedPrivateNetworks = [];
  //       }).finally(() => {
  //         this.loaders.privateNetworks = false;
  //       });
  //   }

  //   setInstanceName() {
  //     if (isEmpty(this.model.name) || !this.isNameUpdated) {
  //       this.model.name = `${get(this.model, 'flavor.name', '')}-${get(this.model, 'region.microRegion.code', '')}`.toLowerCase();
  //     }
  //   }

  //   /*--------------------------
  //      |  Step 5: Billing period  |
  //      --------------------------*/

  //   initBillingPeriod() {
  //     this.resetStep5();
  //   }

  //   isStep5Valid() {
  //     return isString(this.model.billingPeriod) && !isEmpty(this.model.billingPeriod);
  //   }

  //   resetStep5() {
  //     this.model.billingPeriod = null;
  //     this.submitted.step5 = false;
  //   }

  //   /*-------------------
  //      |  Submit the form  |
  //      -------------------*/
}
