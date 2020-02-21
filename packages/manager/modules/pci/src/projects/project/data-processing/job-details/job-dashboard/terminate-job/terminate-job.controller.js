export default class {
  /* @ngInject */
  constructor($state, dataProcessingService) {
    this.$state = $state;
    this.dataProcessingService = dataProcessingService;
    this.deleteJob = this.deleteJob.bind(this);
  }

  deleteJob() {
    this.dataProcessingService
      .terminateJob(this.projectId, this.jobId)
      .then(() => {
        this.$state.go(
          'pci.projects.project.data-processing.job-details.dashboard',
          { projectId: this.projectId },
          { reload: true },
        );
      });
  }

  dismissModal() {
    this.closeModal();
  }

  closeModal() {
    this.$state.go(
      'pci.projects.project.data-processing.job-details.dashboard',
      { projectId: this.projectId },
    );
  }
}
