import get from 'lodash/get';
import reduce from 'lodash/reduce';
import { PATTERN } from '../../../../../components/project/instance/name/constants';
import Flavor from '../../../../../components/project/flavors-list/flavor.class';
import Instance from '../../../../../components/project/instance/instance.class';
import { EDIT_PAGE_SECTIONS } from '../instance.constants';

export default class PciInstanceEditController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    ovhManagerRegionService,
    PciProjectsProjectInstanceService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.EDIT_PAGE_SECTIONS = EDIT_PAGE_SECTIONS;
  }

  $onInit() {
    this.isLoading = false;
    this.instanceNamePattern = PATTERN;

    this.editInstance = new Instance({
      ...this.instance,
      monthlyBilling: this.instance.isMonthlyBillingActivated(),
    });

    this.defaultImage = null;
    this.defaultFlavor = null;

    this.messageContainers = ['name', 'image', 'flavor', 'billing'];
    this.messages = {};
    this.model = {
      isInstanceFlex: false,
    };
    this.imageEditMessage =
      this.imageEditMessage ||
      'pci_projects_project_instances_instance_edit_reboot_message';
    this.imageEditSuccessMessage =
      this.imageEditSuccessMessage ||
      'pci_projects_project_instances_instance_edit_image_success_message';

    this.loadMessages();
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
    if (
      flavorGroup &&
      (this.instance.image || this.instance.volumes.length > 0)
    ) {
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
        this.defaultFlavor.isFlex(),
      );
    }
  }

  canSwitchToFlex() {
    if (this.model.flavorGroup) {
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
    return this.PciProjectsProjectInstanceService.reinstall(
      this.projectId,
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
}
