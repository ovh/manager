import get from 'lodash/get';

export default class PciTrainingJobsKillController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    CucRegionService,
    PciProjectTrainingJobsService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectTrainingJobsService = PciProjectTrainingJobsService;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.jobs.submit',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  confirmKillJob() {
    return this.killJob()
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_job_kill_success',
          ),
          'success',
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_job_kill_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
