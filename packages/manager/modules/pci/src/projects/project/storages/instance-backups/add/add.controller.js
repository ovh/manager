import get from 'lodash/get';
import has from 'lodash/has';

import Datacenter from '../../../../../components/project/regions-list/datacenter.class';
import Quota from '../../../../../components/project/instance/quota/quota.class';
import { PATTERN } from '../../../../../components/project/instance/name/constants';
import Instance from '../../../../../components/project/instance/instance.class';
import { THREE_AZ_REGION } from '../../../project.constants';
import { INSTANCE_RESILIENCE_3AZ } from '../../../instances/instances.constants';

export default class PciInstancesAddController {
  /* @ngInject */
  constructor(
    $translate,
    $q,
    CucCloudMessage,
    ovhManagerRegionService,
    PciProjectsProjectInstanceService,
    coreConfig,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.THREE_AZ_REGION = THREE_AZ_REGION;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.instance = new Instance({
      imageId: this.backup.id,
      region: this.backup.region,
      monthlyBilling: false,
      sshKey: null,
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

    this.resilience3azLink =
      INSTANCE_RESILIENCE_3AZ[this.user.ovhSubsidiary] ||
      INSTANCE_RESILIENCE_3AZ.DEFAULT;

    this.regionsTypesAvailability = {};
    this.showAvailabilityZoneSelection = false;
    this.backupRegion = null;
    this.availabilityZone = {
      auto: true,
      zone: null,
    };
    return this.$q.all(
      this.fetchRegionsTypesAvailability(),
      this.fetchBackupRegion(),
    );
  }

  fetchRegionsTypesAvailability() {
    return this.PciProjectsProjectInstanceService.getRegionsTypesAvailability(
      this.projectId,
    ).then((regionsTypesAvailability) => {
      this.regionsTypesAvailability = regionsTypesAvailability;
    });
  }

  fetchBackupRegion() {
    return this.PciProjectsProjectInstanceService.getProductAvailability(
      this.projectId,
      undefined,
      'snapshot',
    ).then(({ plans }) => {
      const backupPlan = plans.find(
        (p) =>
          p.code.startsWith('snapshot.consumption') &&
          p.regions.some((r) => r.name === this.backup.region),
      );

      this.backupRegion = backupPlan.regions.find(
        (r) => r.name === this.backup.region,
      );
      this.showAvailabilityZoneSelection =
        this.backupRegion.type === THREE_AZ_REGION;
    });
  }

  IsComingSoonPricingBannerDisplayed() {
    return !this.model.flavorGroup?.prices?.monthly;
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

  create() {
    this.isLoading = true;

    if (this.backup.type !== 'linux') {
      this.instance.userData = null;
    }

    this.instance.sshKey = this.model.sshKey;

    return (this.model.privateNetwork.id
      ? this.PciProjectsProjectInstanceService.getSubnets(
          this.projectId,
          this.model.privateNetwork.id,
        )
      : Promise.resolve()
    )
      .then((data) => {
        const network = {
          private: this.model.privateNetwork.id
            ? {
                network: {
                  id: this.model.privateNetwork.regions.find(
                    (r) => r.region === this.instance.region,
                  ).openstackId,
                  subnetId: data.find(
                    (subnet) =>
                      subnet.ipPools[0].region === this.instance.region,
                  )?.id,
                },
              }
            : null,
          public: true,
        };

        return this.PciProjectsProjectInstanceService.save(
          this.projectId,
          this.instance.region,
          {
            ...this.instance,
            network,
            availabilityZone:
              !this.availabilityZone.auto && !!this.availabilityZone.zone
                ? this.availabilityZone.zone
                : null,
          },
          this.model.number,
        );
      })
      .then(() => {
        let messageType = null;
        if (this.model.privateNetwork.id) {
          messageType = 'private_network';
        }

        return this.goBack(
          this.$translate.instant(
            `pci_projects_project_instances_backup_add_success_message${
              messageType ? `_${messageType}` : ''
            }`,
          ),
          'success',
        );
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
