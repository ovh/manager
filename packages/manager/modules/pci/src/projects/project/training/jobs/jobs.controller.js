export default class PciTrainingJobController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService, PciProjectTrainingJobService) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
  }

  $onInit() {
    this.PciProjectTrainingJobService.getAll(this.projectId).then((jobs) => {
      this.jobList = jobs;
    })
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.jobs',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
