import get from 'lodash/get';

export default class PciInstanceAttachVolumeController {
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

  attachStorage(storage) {
    this.isLoading = true;

    return this.PciProjectsProjectInstanceService
      .attachVolume(this.projectId, storage, this.instance)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_instances_instance_attach-volume_success_message',
            {
              volume: storage.name,
              instance: this.instance.id,
            },
          ),
          'pci.projects.project.instances.instance',
        );
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_instances_instance_attach-volume_error_attach',
            {
              message: get(err, 'data.message', null),
              volume: storage.name,
            },
            'pci.projects.project.instances.instance',
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
        return this.goBack();
      });
  }
}
