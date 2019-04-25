import find from 'lodash/find';
import has from 'lodash/has';
import map from 'lodash/map';

import Quota from '../../../../components/project/instance/quota/quota.class';
import Datacenter from './regions-list/datacenter.class';
import { PATTERN } from '../../../../components/project/instance/name/constants';

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
    this.loaders = {
      areRegionsLoading: false,
      isSubmitting: false,
    };

    this.regions = [];
    this.quota = null;
    this.flavor = null;
    this.onlyDisplaySelectedRegion = false;

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

    this.submitted = {
      flavor: false,
      region: false,
    };

    this.instanceNamePattern = PATTERN;
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
    this.flavor = find(this.model.flavorGroup.flavors, { osType: this.model.image.type });
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
