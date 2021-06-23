import get from 'lodash/get';
import has from 'lodash/has';

import Datacenter from '../../../../../components/project/regions-list/datacenter.class';
import Quota from '../../../../../components/project/instance/quota/quota.class';
import { PATTERN } from '../../../../../components/project/instance/name/constants';
import Instance from '../../../../../components/project/instance/instance.class';

export default class PciInstancesAddController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    CucRegionService,
    PciProjectsProjectInstanceService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.instance = new Instance({
      imageId: this.backup.id,
      region: this.backup.region,
      monthlyBilling: false,
      sshKeyId: null,
    });

    this.region = new Datacenter({
      name: this.backup.region,
      quota: this.quota,
    });
    this.instanceQuota = new Quota(this.quota.instance);

    this.maxQuota = 1;
    this.defaultInstanceName = '';

    this.isLoading = false;

    const defaultPrivateNetwork = {
      id: '',
      name: this.$translate.instant(
        'pci_projects_project_instances_backup_add_private_network_none',
      ),
    };

    this.model = {
      flavorGroup: null,
      number: 1,
      sshKey: null,
      privateNetwork: defaultPrivateNetwork,
      isInstanceFlex: false,
    };

    this.instanceNamePattern = PATTERN;
    this.availablePrivateNetworks = [
      defaultPrivateNetwork,
      ...this.privateNetworks,
    ];

    this.loadMessages();
  }

  onFlavorChange(flavor) {
    this.flavor = flavor.getFlavorByOsType(this.backup.type);

    this.instance.flavorId = flavor.getFlavorId(
      this.backup.type,
      this.backup.region,
    );

    this.maxQuota = this.instanceQuota.getMaxNumberOfInstances(this.flavor);

    this.generateInstanceName();
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
      this.backup.type,
      isFlex,
    );

    this.instance.flavorId = this.model.flavorGroup.getFlavorId(
      this.backup.type,
      this.instance.region,
      isFlex,
    );
    this.generateInstanceName();
  }

  canSwitchToFlex() {
    if (this.model.flavorGroup) {
      return (
        this.model.flavorGroup.hasFlexOption() &&
        this.backup.minDisk <=
          this.model.flavorGroup.getFlavorByOsType(this.backup.type, true).disk
      );
    }

    return false;
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.instance-backups.add',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onPrivateNetworkChange(modelValue) {
    const networkId = get(modelValue, 'id');
    this.instance.networks = networkId
      ? [
          {
            networkId,
          },
          {
            networkId: this.publicNetwork.id,
          },
        ]
      : [];
  }

  create() {
    this.isLoading = true;

    if (this.backup.type !== 'linux') {
      this.instance.userData = null;
    }

    this.instance.sshKeyId = get(this.model.sshKey, 'id');

    return this.PciProjectsProjectInstanceService.save(
      this.projectId,
      this.instance,
      this.model.number,
    )
      .then(() => {
        const message =
          this.model.number === 1
            ? this.$translate.instant(
                'pci_projects_project_instances_backup_add_success_message',
                {
                  instance: this.instance.name,
                },
              )
            : this.$translate.instant(
                'pci_projects_project_instances_backup_add_success_multiple_message',
              );
        return this.goBack(message);
      })
      .catch((error) => {
        let message;
        if (this.model.number === 1) {
          message = this.$translate.instant(
            'pci_projects_project_instances_backup_add_error_save',
            {
              instance: this.instance.name,
              message: get(error, 'data.message', null),
            },
          );
        } else {
          message = this.$translate.instant(
            'pci_projects_project_instances_backup_add_error_multiple_save',
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
}
