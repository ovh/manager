import get from 'lodash/get';
import reduce from 'lodash/reduce';
import { PATTERN } from '../../../../../components/project/instance/name/constants';
import Flavor from '../../../../../components/project/flavors-list/flavor.class';
import Instance from '../../../../../components/project/instance/instance.class';
import { EDIT_PAGE_SECTIONS } from '../instance.constants';
import { INSTANCE_PRICING_LINKS } from '../../instances.constants';
import { PCI_FEATURES, THREE_AZ_REGION } from '../../../project.constants';

export default class PciInstanceEditController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    ovhManagerRegionService,
    PciProjectsProjectInstanceService,
    PciProject,
    coreConfig,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.coreConfig = coreConfig;
    this.PciProject = PciProject;
    this.EDIT_PAGE_SECTIONS = EDIT_PAGE_SECTIONS;
    this.instancePricesLink =
      INSTANCE_PRICING_LINKS[coreConfig.getUser().ovhSubsidiary] ||
      INSTANCE_PRICING_LINKS.DEFAULT;
    this.THREE_AZ_REGION = THREE_AZ_REGION;
  }

  $onInit() {
    this.isLoading = false;
    this.instanceNamePattern = PATTERN;
    this.globalRegionsUrl = this.PciProject.getDocumentUrl('GLOBAL_REGIONS');
    this.localZoneUrl = this.PciProject.getDocumentUrl('LOCAL_ZONE');
    this.zone3azUrl = this.PciProject.getDocumentUrl('REGIONS_3AZ');
    this.is3az = this.instance.planCode.includes('3AZ');

    this.editInstance = new Instance({
      ...this.instance,
      monthlyBilling: this.instance.isMonthlyBillingActivated(),
    });

    this.defaultImage = null;
    this.defaultFlavor = null;

    this.messageContainers = ['name', 'image', 'flavor', 'billing'];
    this.messages = {};
    this.model = {
      isInstanceFlex: new Flavor(this.editInstance.flavor).isFlex(),
    };
    this.regionsTypesAvailability = {};
    this.fetchRegionsTypesAvailability();
    this.imageEditSuccessMessage =
      this.imageEditSuccessMessage ||
      'pci_projects_project_instances_instance_edit_image_success_message';

    this.loadMessages();
    this.updateInstanceFlavor();
    this.getUAppUrl(
      'public-cloud',
      `#/pci/projects/${this.projectId}/savings-plan`,
    ).then((url) => {
      this.savingsPlanUrl = url;
    });
  }

  fetchRegionsTypesAvailability() {
    this.PciProjectsProjectInstanceService.getRegionsTypesAvailability(
      this.projectId,
    ).then((regionsTypesAvailability) => {
      this.regionsTypesAvailability = regionsTypesAvailability;
    });
  }

  updateInstanceFlavor() {
    this.instance.flavor.tags = this.catalog.addons.find(
      (addon) => addon.planCode === this.instance.flavor.planCodes.hourly,
    )?.blobs?.tags;
  }

  get isSavingsPlanAvailable() {
    return (
      this.pciFeatures.isFeatureAvailable(PCI_FEATURES.PRODUCTS.SAVINGS_PLAN) &&
      !this.instance.isLocalZone
    );
  }

  loadMessages() {
    this.messageHandlers = reduce(
      this.messageContainers,
      (handlers, containerName) => ({
        ...handlers,
        [containerName]: this.CucCloudMessage.subscribe(
          `pci.projects.project.instances.instance.edit-${containerName}`,
          {
            onMessage: () => this.refreshMessages(),
          },
        ),
      }),
      {},
    );
  }

  refreshMessages() {
    this.messages = reduce(
      this.messageContainers,
      (messages, containerName) => ({
        ...messages,
        [containerName]: this.messageHandlers[containerName].getMessages(),
      }),
      {},
    );
  }

  onImageChange(image) {
    if (image) {
      if (!this.defaultImage) {
        this.defaultImage = image;
      }
      if (image.isBackup()) {
        this.editInstance.imageId = image.id;
      } else {
        this.editInstance.imageId = image.getIdByRegion(this.instance.region);
      }
    } else {
      this.editInstance.imageId = null;
    }
  }

  onFlavorChange(flavorGroup) {
    if (flavorGroup) {
      const flavorType =
        this.instance?.image?.type || this.instance.flavor.osType;
      if (!this.defaultFlavor) {
        const flavor = new Flavor(this.instance.flavor);
        this.defaultFlavor = flavorGroup.getFlavorByOsType(
          flavorType,
          flavor.isFlex(),
        );
      }

      this.editInstance.flavorId = flavorGroup.getFlavorId(
        flavorType,
        this.instance.region,
        this.model.isInstanceFlex,
      );
    }
  }

  canSwitchToFlex() {
    if (this.model.flavorGroup && this.defaultFlavor && this.instance.image) {
      return (
        this.model.flavorGroup.hasFlexOption() &&
        this.defaultFlavor.disk <=
          get(
            this.model.flavorGroup.getFlavorByOsType(
              this.instance.image.type,
              true,
            ),
            'disk',
            0,
          )
      );
    }

    return false;
  }

  onFlexChange(isFlex) {
    this.editInstance.flavorId = this.model.flavorGroup.getFlavorId(
      this.instance.image.type,
      this.instance.region,
      isFlex,
    );
  }

  renameInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.update(
      this.projectId,
      this.editInstance,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_edit_name_success_message',
            {
              instance: this.editInstance.name,
            },
          ),
        ),
      )
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_instances_instance_edit_name_error_put',
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.instances.instance.edit-name',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  reinstallInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.reinstallFromRegion(
      this.projectId,
      this.instance.region,
      this.instance.id,
      this.editInstance,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(this.imageEditSuccessMessage, {
            instance: this.editInstance.name,
          }),
        ),
      )
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_instances_instance_edit_image_error_put',
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.instances.instance.edit-image',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  resizeInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.resize(
      this.projectId,
      this.editInstance,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_edit_flavor_success_message',
            {
              instance: this.editInstance.name,
            },
          ),
        ),
      )
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_instances_instance_edit_flavor_error_put',
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.instances.instance.edit-flavor',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  activateMonthlyBilling() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.activeMonthlyBilling(
      this.projectId,
      this.editInstance,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_edit_billing_success_message',
            {
              instance: this.editInstance.name,
            },
          ),
        ),
      )
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_instances_instance_edit_billing_error_put',
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.instances.instance.edit-billing',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  isLoosingMonthlyPlan() {
    return (
      Boolean(this.instance.monthlyBilling) &&
      this.model.flavorGroup?.flavors.find(
        ({ id }) => id === this.editInstance.flavorId,
      )?.planCodes.monthly === null
    );
  }
}
