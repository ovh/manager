import get from 'lodash/get';

export default class PciTrainingDataSyncController {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    CucRegionService,
    PciProjectTrainingDataService,
    $translate,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectTrainingDataService = PciProjectTrainingDataService;
    this.$translate = $translate;
  }

  $onInit() {
    this.loadMessages();
    this.direction = 'pull';
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.data.sync',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  sync() {
    this.loading = true;

    return this.PciProjectTrainingDataService.sync(
      this.projectId,
      this.dataId,
      this.direction,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_data_sync_success',
          ),
          'error',
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_data_sync_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
