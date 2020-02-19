import get from 'lodash/get';

export default class PciInstanceReinstallController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, PciProjectsProjectInstanceService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.isLoading = false;
    this.reinstallSuccessMessage =
      this.reinstallSuccessMessage ||
      'pci_projects_project_instances_instance_reinstall_success_message';
  }

  reinstallInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.reinstall(
      this.projectId,
      this.instance,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(this.reinstallSuccessMessage, {
            instance: this.instance.name,
          }),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_reinstall_error_reinstall',
            {
              message: get(err, 'data.message', null),
              instance: this.instance.name,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
