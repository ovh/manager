import get from 'lodash/get';

export default class PciInstanceShelveController {
  /* @ngInject */
  constructor(
    $translate,
    OvhApiCloudProjectInstance,
    PciProjectsProjectInstanceService,
  ) {
    this.$translate = $translate;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.isLoading = false;
  }

  shelveInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.shelve(
      this.projectId,
      this.instance,
    )
      .then(() => this.OvhApiCloudProjectInstance.v6().resetQueryCache())
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_shelve_success_inprogress_message',
            {
              instance: this.instance.name,
            },
          ),
        );
      })
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_shelve_error_message',
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
