export default class PciTrainingJobsInfoLogsController {
  /* @ngInject */
  constructor($interval, PciProjectTrainingJobService) {
    this.$interval = $interval;
    this.pciProjectTrainingJobService = PciProjectTrainingJobService;
  }

  $onDestroy() {
    if (this.interval !== null) {
      this.$interval.cancel(this.interval);
    }
  }

  $onInit() {
    if (this.job.isRunning()) {
      this.interval = this.$interval(() => {
        this.pciProjectTrainingJobService
          .logs(this.projectId, this.jobId)
          .then((jobLog) => {
            this.jobLog = jobLog;
          });
      }, 3000);
    }
  }
}
