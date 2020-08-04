export default class PciTrainingDashboardController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.loadMessages();
    this.eaiConsoleUrl = 'https://console.gra.training.ai.cloud.ovh.net';
    this.eaiDocsUrl = 'https://docs.console.gra.training.ai.cloud.ovh.net';
    this.runningJobs = this.getJobsWithSelector((job) => job.isRunning());
    this.nbRunning = this.runningJobs.length;
    this.nbSuccess = this.getJobsNumberWithSelector((job) => job.isSuccess());
    this.nbFailed = this.getJobsNumberWithSelector((job) => job.isFailed());
    this.nbOther =
      this.jobList.length - this.nbSuccess - this.nbFailed - this.nbRunning;
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.dashboard',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getJobsWithSelector(selectFunction) {
    return this.jobList.filter((job) => selectFunction(job));
  }

  getJobsNumberWithSelector(selectFunction) {
    return this.getJobsWithSelector(selectFunction).length;
  }
}
