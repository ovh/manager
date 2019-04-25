import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import has from 'lodash/has';
import sortBy from 'lodash/sortBy';
import includes from 'lodash/includes';

import Quota from '../../../../components/project/instance/quota/quota.class';
import { PATTERN } from '../../../../components/project/instance/name/constants';
import Instance from '../instance.class';

export default class PciInstancesAddController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    OvhApiCloudProjectInstance,
    PciProjectRegions,
    PciProjectsProjectInstanceService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.PciProjectRegions = PciProjectRegions;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.instance = new Instance({
      monthlyBilling: true,
    });

    this.isLoading = false;

    this.showUserData = false;
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
    this.CucCloudMessage.unSubscribe('pci.projects.project.instances.add');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.instances.add', { onMessage: () => this.refreshMessages() });
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
          filter(
            this.privateNetworks,
            network => find(
              network.regions,
              {
                region: this.instance.region,
                status: 'ACTIVE',
              },
            ),
          ),
          privateNetwork => ({
            ...privateNetwork,
            name: `${privateNetwork.vlanId.toString().padStart(4, '0')} - ${privateNetwork.name}`,
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
    this.instance.imageId = this.model.image.getIdByRegion(this.instance.region);
    this.flavor = this.model.flavorGroup.getFlavorByOsType(this.model.image.type);

    this.instance.flavorId = this.model.flavorGroup.getFlavorId(
      this.model.image.type,
      this.instance.region,
    );

    if (this.model.image.type !== 'linux') {
      this.model.sshKey = null;
      this.instance.sshKeyId = null;
    } else {
      this.instance.sshKeyId = get(this.model.sshKey, 'id');
    }
  }

  showImageNavigation() {
    return this.model.image && (this.model.image.type !== 'linux' || this.model.sshKey);
  }

  onInstanceFocus() {
    this.quota = new Quota(this.model.datacenter.quota.instance);

    if (!has(this.instance, 'name')) {
      this.instance.name = `${this.flavor.name}-${this.instance.region}`.toLowerCase();
    }
  }

  onInstanceChange() {
    if (get(this.selectedPrivateNetwork, 'id')) {
      this.instance.networks = [{
        networkId: get(this.selectedPrivateNetwork, 'id'),
      }];
    } else {
      this.instance.networks = [];
    }
  }

  isRegionAvailable(datacenter) {
    return this.model.flavorGroup.isAvailableInRegion(datacenter.name)
      && datacenter.isAvailable()
      && datacenter.hasEnoughQuota();
  }

  create() {
    this.isLoading = true;

    if (this.model.image.type !== 'linux') {
      this.instance.userData = null;
    }

    return this.PciProjectsProjectInstanceService
      .save(this.projectId, this.instance, this.model.number)
      .then(() => {
        let message;
        if (this.model.number === 1) {
          message = this.$translate.instant(
            'pci_projects_project_instances_add_success_message',
            {
              instance: this.instance.name,
            },
          );
        } else {
          message = this.$translate.instant('pci_projects_project_instances_add_success_multiple_message');
        }
        this.CucCloudMessage.success(
          message,
          'pci.projects.project.instances',
        );
        return this.goBack();
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

        this.CucCloudMessage.error(message, 'pci.projects.project.instances.add');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
