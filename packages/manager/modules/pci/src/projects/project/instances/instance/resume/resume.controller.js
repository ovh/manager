import get from 'lodash/get';

export default class PciInstanceResumeController {
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

  resumeInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService
      .resume(this.projectId, this.instance)
      .then(() => this.goBack(
        this.$translate.instant(
          'pci_projects_project_instances_instance_resume_success_message',
          {
            instance: this.instance.name,
          },
        ),
      ))
      .catch((err) => this.goBack(
        this.$translate.instant(
          'pci_projects_project_instances_instance_resume_error_resume',
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
