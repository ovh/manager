import filter from 'lodash/filter';
import { getCriteria } from '../../project.utils';

export default class PciTrainingJobController {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    CucRegionService,
    PciProjectTrainingJobService,
    $interval,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
    this.$interval = $interval;
  }

  $onDestroy() {
    if (this.interval !== null) {
      this.$interval.cancel(this.interval);
    }
  }

  $onInit() {
    this.loadData();
    this.loadMessages();
    this.criteria = getCriteria('id', this.jobId);
    this.interval = this.$interval(() => {
      this.loadData();
    }, 10000);
  }

  loadData() {
    return this.PciProjectTrainingJobService.getAll(this.projectId).then(
      (jobs) => {
        if (!filter(jobs, (x) => x.isTerminal()).length > 0) {
          this.$onDestroy();
        }
        this.jobList = jobs;
      },
    );
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
