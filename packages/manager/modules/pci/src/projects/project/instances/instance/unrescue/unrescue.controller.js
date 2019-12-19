import get from 'lodash/get';

export default class PciInstanceUnrescueController {
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

  unrescueInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService
      .unrescue(this.projectId, this.instance)
      .then(() => this.goBack(
        this.$translate.instant(
          'pci_projects_project_instances_instance_unrescue_success_message',
          {
            instance: this.instance.name,
          },
        ),
      ))
      .catch((err) => this.goBack(
        this.$translate.instant(
          'pci_projects_project_instances_instance_unrescue_error_unrescue',
          {
            message: get(err, 'data.message', null),
            instance: this.instance.name,
          },
        ),
        'error',
      ))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
