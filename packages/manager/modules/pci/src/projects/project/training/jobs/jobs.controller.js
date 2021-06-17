import filter from 'lodash/filter';

export default class PciTrainingJobController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService, PciProjectTrainingJobService, ouiDatagridService, $interval) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
    this.ouiDatagridService = ouiDatagridService;
    this.$interval = $interval;

    this.terminalState = ["DONE", "ERROR", "FAILED", "INTERRUPTED"];
  }

  $onDestroy() {
    if (this.interval !== null) {
      this.$interval.cancel(this.interval);
    }
  }

  $onInit() {
    this.loadData();
    this.loadMessages();
    this.interval = this.$interval(() => {
      this.loadData();
    }, 10000);
  }

  loadData() {
    return this.PciProjectTrainingJobService.getAll(this.projectId).then((jobs) => {
      if (!this.hasNonTerminalJob(jobs)) {
        this.$onDestroy();
      }
      this.jobList = jobs;
    });
  }

  hasNonTerminalJob(jobs) {
    return filter(jobs, x => !this.terminalState.includes(x.status.state)).length > 0;
  }

  refreshList() {
    this.loadData().then(() => this.ouiDatagridService.refresh("publicCloudTrainingJobsDatagrid", true));
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
