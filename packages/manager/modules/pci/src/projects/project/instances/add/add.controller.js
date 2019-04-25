import get from 'lodash/get';
import has from 'lodash/has';
import map from 'lodash/map';

import Quota from '../../../../components/project/instance/quota/quota.class';
import Datacenter from './regions-list/datacenter.class';
import { PATTERN } from '../../../../components/project/instance/name/constants';
import Instance from '../instance.class';

export default class CloudProjectComputeInfrastructureVirtualMachineAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    CucRegionService,
    OvhApiCloudProjectInstance,
    OvhApiCloudProjectRegion,
    PciProjectRegions,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
    this.PciProjectRegions = PciProjectRegions;
  }

  $onInit() {
    this.instance = new Instance({});

    this.loaders = {
      areRegionsLoading: false,
      isSubmitting: false,
    };

    this.showUserData = false;
    this.regions = [];
    this.quota = null;
    this.flavor = null;

    this.loadMessages();

    this.model = {
      flavorGroup: null,
      image: null,
      monthlyBilling: true,
      number: 1,
      location: null,
      datacenter: null,
      sshKey: null,
    };

    this.instanceNamePattern = PATTERN;

    this.defaultPrivateNetwork = {
      id: '',
      name: this.$translate.instant('pci_projects_project_instances_add_privateNetwork_none'),
    };
    this.selectedPrivateNetwork = this.defaultPrivateNetwork;
    this.privateNetworks = [this.defaultPrivateNetwork];
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.instances.new');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.instances.new', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }


  onFlavorFocus() {
    this.displaySelectedFlavor = false;
  }

  onFlavorChange() {
    this.displaySelectedFlavor = true;
  }

  onRegionFocus() {
    this.displaySelectedRegion = false;
  }

  onRegionChange() {
    this.displaySelectedRegion = true;
    this.instance.region = this.model.datacenter.name;
  }

  onImageFocus() {
    this.displaySelectedImage = false;
  }

  onImageChange() {
    this.displaySelectedImage = true;
    this.instance.imageId = this.model.image.getIdByRegion(this.instance.region);
    this.flavor = this.model.flavorGroup.getFlavorByOsType(this.model.image.type);
    this.instance.flavorId = get(this.flavor, 'id');
  }

  onInstanceFocus() {
    this.quota = new Quota(this.model.datacenter.quota.instance);

    if (!this.instance.name) {
      this.instance.name = `${this.selectedFlavor.name}-${this.instance.region}`.toLowerCase();
    }
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

  create() {
    this.loaders.isSubmitting = true;

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
}
