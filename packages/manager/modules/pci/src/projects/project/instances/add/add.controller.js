import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import has from 'lodash/has';
import some from 'lodash/some';

import Quota from '../../../../components/project/instance/quota/quota.class';
import { PATTERN } from '../../../../components/project/instance/name/constants';
import Instance from '../instance.class';

export default class CloudProjectComputeInfrastructureVirtualMachineAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    OvhApiCloudProjectInstance,
    PciProjectsProjectInstanceService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.instance = new Instance({
      monthlyBilling: true,
    });

    this.loaders = {
      areRegionsLoading: false,
      isSubmitting: false,
    };

    this.showUserData = false;
    this.showOnlyAvailableRegions = false;

    this.quota = null;
    this.flavor = null;

    this.loadMessages();

    this.model = {
      flavorGroup: null,
      image: null,
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
    this.availablePrivateNetworks = [this.defaultPrivateNetwork];
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

    this.availablePrivateNetworks = [
      this.defaultPrivateNetwork,
      ...filter(
        this.privateNetworks,
        network => find(
          network.regions,
          {
            region: this.instance.region,
            status: 'ACTIVE',
          },
        ),
      ),
    ];
  }

  onImageFocus() {
    this.displaySelectedImage = false;
  }

  onImageChange() {
    this.displaySelectedImage = true;
    this.instance.imageId = this.model.image.getIdByRegion(this.instance.region);
    this.flavor = this.model.flavorGroup.getFlavorByOsType(this.model.image.type);
    this.instance.flavorId = get(this.flavor, 'id');

    this.instance.sshKeyId = get(this.model.sshKey, 'id');
  }

  showImageNavigation() {
    return this.model.image && (this.model.image.type !== 'linux' || this.model.sshKey);
  }

  onInstanceFocus() {
    this.quota = new Quota(this.model.datacenter.quota.instance);

    if (!has(this.instance, 'name')) {
      this.instance.name = `${this.selectedFlavor.name}-${this.instance.region}`.toLowerCase();
    }
  }

  isRegionAvailable(datacenter) {
    return this.model.flavorGroup.isAvailableInRegion(datacenter.name)
      && datacenter.isAvailable()
      && datacenter.hasEnoughQuotaForFlavor(this.model.flavorGroup);
  }

  isLocationAvailable(datacenters) {
    return some(datacenters, datacenter => this.isRegionAvailable(datacenter));
  }

  isRegionActive(datacenter) {
    return this.availableRegions.includes(datacenter.name);
  }

  createQuota() {
    this.quota = new Quota(this.model.datacenter.quota.instance);
  }

  getUnavailabilityReason(datacenter) {
    if (!this.model.flavorGroup.isAvailableInRegion(datacenter.name)) {
      return 'UNAVAILABLE';
    }

    if (!datacenter.isAvailable()) {
      return 'INACTIVE';
    }

    if (has(datacenter, 'quota.instance')) {
      if (!datacenter.checkInstancesNumber()) {
        return 'INSTANCE';
      }

      if (!datacenter.checkRamQuotaForFlavor(this.model.flavorGroup)) {
        return 'RAM';
      }

      if (!datacenter.checkCoresQuota(this.model.flavorGroup)) {
        return 'VCPUS';
      }
    }

    return 'UNKWOWN';
  }

  create() {
    this.loaders.isSubmitting = true;

    return this.PciProjectsProjectInstanceService
      .save(this.projectId, this.instance, this.model.number)
      .then(() => {

      })
      .catch(error => console.log(error))
      .finally(() => {
        this.loaders.isSubmitting = false;
      });
  }
}
