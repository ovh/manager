import get from 'lodash/get';

export default class PciInstanceRebootController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciProjectsProjectInstanceService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.isLoading = false;
  }

  rebootInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService
      .reboot(this.projectId, this.instance, this.rebootType)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_instances_instance_reboot_success_message',
            {
              instance: this.instance.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_instances_instance_reboot_error_reboot',
            {
              message: get(err, 'data.message', null),
            },
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
        return this.goBack();
      });
  }
}
