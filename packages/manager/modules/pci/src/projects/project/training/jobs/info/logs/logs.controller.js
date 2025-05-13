export default class PciTrainingJobsInfoLogsController {
  /* @ngInject */
  constructor($interval, PciProjectTrainingJobService) {
    this.$interval = $interval;
    this.pciProjectTrainingJobService = PciProjectTrainingJobService;
    this.currentJob = this.job;
  }

  $onDestroy() {
    if (this.interval !== null) {
      this.$interval.cancel(this.interval);
    }
  }

  $onInit() {
    this.pollJob();
    this.interval = this.$interval(() => {
      this.pollJob();
      this.pciProjectTrainingJobService
        .logs(this.projectId, this.jobId)
        .then((jobLog) => {
          this.jobLog = jobLog;
        });
    }, 3000);
  }

  pollJob() {
    this.pciProjectTrainingJobService
      .get(this.projectId, this.jobId)
      .then((currentJob) => {
        this.currentJob = currentJob;
      });
  }
}
