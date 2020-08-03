export default class PciTrainingDashboardController {
  $onInit() {
    this.eaiConsoleUrl = 'https://console.gra.training.ai.cloud.ovh.net';
    this.eaiDocsUrl = 'https://docs.console.gra.training.ai.cloud.ovh.net';
    this.runningJobs = this.getJobsWithSelector((job) => job.isRunning());
    this.nbRunning = this.runningJobs.length;
    this.nbSuccess = this.getJobsNumberWithSelector((job) => job.isSuccess());
    this.nbFailed = this.getJobsNumberWithSelector((job) => job.isFailed());
    this.nbOther =
      this.jobList.length - this.nbSuccess - this.nbFailed - this.nbRunning;
  }

  getJobsWithSelector(selectFunction) {
    return this.jobList.filter((job) => selectFunction(job));
  }

  getJobsNumberWithSelector(selectFunction) {
    return this.getJobsWithSelector(selectFunction).length;
  }
}
