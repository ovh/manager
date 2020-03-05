export default class {
  /* @ngInject */
  constructor($state, dataProcessingService) {
    this.$state = $state;
    this.dataProcessingService = dataProcessingService;
    this.deleteJob = this.deleteJob.bind(this);
  }

  deleteJob() {
    return this.dataProcessingService
      .terminateJob(this.projectId, this.jobId)
      .then(() => {
        this.goBack();
      });
  }

  closeModal() {
    this.goBack();
  }
}
