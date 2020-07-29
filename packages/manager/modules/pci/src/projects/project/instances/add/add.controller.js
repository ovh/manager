import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import has from 'lodash/has';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';

import Quota from '../../../../components/project/instance/quota/quota.class';
import { PATTERN } from '../../../../components/project/instance/name/constants';
import Instance from '../../../../components/project/instance/instance.class';

import { BANDWIDTH_OUT } from './add.constants';

export default class PciInstancesAddController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    coreConfig,
    CucCloudMessage,
    cucUcentsToCurrencyFilter,
    OvhApiCloudProjectInstance,
    PciProjectsProjectInstanceService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.cucUcentsToCurrencyFilter = cucUcentsToCurrencyFilter;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.instance = new Instance({
      monthlyBilling: false,
    });

    this.isLoading = false;
    this.defaultInstanceName = '';

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
      isInstanceFlex: false,
    };

    this.instanceNamePattern = PATTERN;

    this.defaultPrivateNetwork = {
      id: '',
      name: this.$translate.instant(
        'pci_projects_project_instances_add_privateNetwork_none',
      ),
    };
    this.selectedPrivateNetwork = this.defaultPrivateNetwork;
    this.availablePrivateNetworks = [this.defaultPrivateNetwork];
    this.automatedBackup = {
      available: this.coreConfig.getRegion() !== 'US',
      selected: false,
      schedule: null,
      price: null,
    };
    this.addInstanceSuccessMessage =
      this.addInstanceSuccessMessage ||
      'pci_projects_project_instances_add_success_message';
    this.addInstancesSuccessMessage =
      this.addInstancesSuccessMessage ||
      'pci_projects_project_instances_add_success_multiple_message';
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.instances.add',
      { onMessage: () => this.refreshMessages() },
    );
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
      ...sortBy(
        map(
          filter(this.privateNetworks, (network) =>
            find(network.regions, {
              region: this.instance.region,
              status: 'ACTIVE',
            }),
          ),
          (privateNetwork) => ({
            ...privateNetwork,
            name: `${privateNetwork.vlanId.toString().padStart(4, '0')} - ${
              privateNetwork.name
            }`,
          }),
        ),
        ['name'],
      ),
    ];

    if (!includes(this.availablePrivateNetworks, this.selectedPrivateNetwork)) {
      this.selectedPrivateNetwork = this.defaultPrivateNetwork;
    }
  }

  onImageFocus() {
    this.displaySelectedImage = false;
  }

  onImageChange() {
    this.displaySelectedImage = true;
    if (this.model.image.isBackup()) {
      this.instance.imageId = this.model.image.id;
    } else {
      this.instance.imageId = this.model.image.getIdByRegion(
        this.instance.region,
      );
    }

    this.onFlexChange(false);

    if (this.model.image.type !== 'linux') {
      this.model.sshKey = null;
      this.instance.sshKeyId = null;
    } else {
      this.instance.sshKeyId = get(this.model.sshKey, 'id');
    }
  }

  getBackupPrice() {
    return this.PciProjectsProjectInstanceService.getSnapshotMonthlyPrice(
      this.projectId,
      this.instance,
    );
  }

  showImageNavigation() {
    return (
      this.model.image &&
      (this.model.image.type !== 'linux' || this.model.sshKey)
    );
  }

  onInstanceFocus() {
    if (!isEmpty(this.model.datacenter)) {
      this.quota = new Quota(this.model.datacenter.quota.instance);
      this.generateInstanceName();
      if (this.automatedBackup.available) {
        this.automatedBackup.selected = false;
        this.automatedBackup.schedule = null;
        return this.getBackupPrice().then((price) => {
          this.automatedBackup.price = price;
        });
      }
    }
    return this.$q.when();
  }

  onInstanceChange() {
    if (get(this.selectedPrivateNetwork, 'id')) {
      this.instance.networks = [
        {
          networkId: get(this.selectedPrivateNetwork, 'id'),
        },
        {
          networkId: get(this.publicNetwork, 'id'),
        },
      ];
    } else {
      this.instance.networks = [];
    }
  }

  generateInstanceName() {
    if (
      !has(this.instance, 'name') ||
      get(this.instance, 'name') === this.defaultInstanceName
    ) {
      this.defaultInstanceName = `${this.flavor.name}-${this.instance.region}`.toLowerCase();
      this.instance.name = this.defaultInstanceName;
    }
  }

  onFlexChange(isFlex) {
    this.flavor = this.model.flavorGroup.getFlavorByOsType(
      this.model.image.type,
      isFlex,
    );

    this.instance.flavorId = this.model.flavorGroup.getFlavorId(
      this.model.image.type,
      this.instance.region,
      isFlex,
    );
    this.generateInstanceName();
  }

  isRegionAvailable(datacenter) {
    return (
      this.model.flavorGroup.isAvailableInRegion(datacenter.name) &&
      datacenter.isAvailable() &&
      datacenter.hasEnoughQuotaForFlavors(this.model.flavorGroup)
    );
  }

  isLocationAvailable(datacenters) {
    return some(datacenters, (datacenter) =>
      this.isRegionAvailable(datacenter),
    );
  }

  isRegionActive(datacenter) {
    return this.availableRegions.includes(datacenter.name);
  }

  createQuota() {
    if (!isEmpty(this.model.datacenter)) {
      this.quota = new Quota(this.model.datacenter.quota.instance);
    }
  }

  getUnavailabilityReason(datacenter) {
    if (!datacenter.isAvailable()) {
      return 'INACTIVE';
    }

    if (!this.model.flavorGroup.isAvailableInRegion(datacenter.name)) {
      return 'UNAVAILABLE';
    }

    if (has(datacenter, 'quota.instance')) {
      if (!datacenter.checkInstancesNumber()) {
        return 'INSTANCE';
      }

      if (!datacenter.checkRamQuota(this.model.flavorGroup)) {
        return 'RAM';
      }

      if (!datacenter.checkCoresQuota(this.model.flavorGroup)) {
        return 'VCPUS';
      }
    }

    return 'UNKWOWN';
  }

  create() {
    this.isLoading = true;

    if (this.model.image.type !== 'linux') {
      this.instance.userData = null;
    }

    if (this.automatedBackup.available && this.automatedBackup.selected) {
      const { schedule } = this.automatedBackup;
      this.instance.autobackup = {
        cron: `${schedule.cronPattern.minutes} ${schedule.cronPattern.hour} ${schedule.cronPattern.dom} ${schedule.cronPattern.month} ${schedule.cronPattern.dow}`,
        rotation: schedule.rotation,
      };
    }

    return this.PciProjectsProjectInstanceService.save(
      this.projectId,
      this.instance,
      this.model.number,
    )
      .then(() => {
        const message =
          this.model.number === 1
            ? this.$translate.instant(this.addInstanceSuccessMessage, {
                instance: this.instance.name,
              })
            : this.$translate.instant(this.addInstancesSuccessMessage);
        return this.goBack(message, 'success');
      })
      .catch((error) => {
        let message;
        if (this.model.number === 1) {
          message = this.$translate.instant(
            'pci_projects_project_instances_add_error_save',
            {
              instance: this.instance.name,
              message: get(error, 'data.message', null),
            },
          );
        } else {
          message = this.$translate.instant(
            'pci_projects_project_instances_add_error_multiple_save',
            {
              message: get(error, 'data.message', null),
            },
          );
        }

        this.CucCloudMessage.error(
          message,
          'pci.projects.project.instances.add',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getBandwidthExtraCost(region) {
    return this.cucUcentsToCurrencyFilter(
      get(this.prices, `${BANDWIDTH_OUT}.${region.name}`).price,
    );
  }
}
