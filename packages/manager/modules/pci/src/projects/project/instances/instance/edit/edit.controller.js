import get from 'lodash/get';
import reduce from 'lodash/reduce';
import { PATTERN } from '../../../../../components/project/instance/name/constants';
import Instance from '../../../../../components/project/instance/instance.class';

export default class PciInstanceEditController {
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
    this.model = {};

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
      this.editInstance.imageId = image.getIdByRegion(this.instance.region);
    }
  }

  onFlavorChange(flavorGroup) {
    if (flavorGroup && this.instance.image) {
      this.editInstance.flavorId = flavorGroup.getFlavorId(
        this.instance.image.type,
        this.instance.region,
      );

      if (!this.defaultFlavor) {
        this.defaultFlavor = flavorGroup.getFlavorByOsType(this.instance.image.type);
      }
    }
  }

  renameInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService
      .update(this.projectId, this.editInstance)
      .then(() => this.goBack(
        this.$translate.instant(
          'pci_projects_project_instances_instance_edit_name_success_message',
          {
            instance: this.editInstance.name,
          },
        ),
      ))
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
    return this.PciProjectsProjectInstanceService
      .reinstall(this.projectId, this.editInstance)
      .then(() => this.goBack(
        this.$translate.instant(
          'pci_projects_project_instances_instance_edit_image_success_message',
          {
            instance: this.editInstance.name,
          },
        ),
      ))
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
    return this.PciProjectsProjectInstanceService
      .resize(this.projectId, this.editInstance)
      .then(() => this.goBack(
        this.$translate.instant(
          'pci_projects_project_instances_instance_edit_flavor_success_message',
          {
            instance: this.editInstance.name,
          },
        ),
      ))
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
    return this.PciProjectsProjectInstanceService
      .activeMonthlyBilling(this.projectId, this.editInstance)
      .then(() => this.goBack(
        this.$translate.instant(
          'pci_projects_project_instances_instance_edit_billing_success_message',
          {
            instance: this.editInstance.name,
          },
        ),
      ))
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
