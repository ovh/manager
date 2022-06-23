import get from 'lodash/get';

export default class PciInstanceDeleteController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, PciProjectsProjectInstanceService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.isLoading = false;
  }

  deleteInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.delete(
      this.projectId,
      this.instance,
    )
      .then(() =>
        this.goListingInstances(
          this.$translate.instant(
            'pci_projects_project_instances_instance_delete_success_message',
            {
              instance: this.instance.name,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goListingInstances(
          this.$translate.instant(
            'pci_projects_project_instances_instance_delete_error_delete',
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
