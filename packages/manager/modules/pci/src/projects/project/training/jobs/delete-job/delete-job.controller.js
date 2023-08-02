export default class PciTrainingJobsDeleteJobController {
  /* @ngInject */
  constructor($translate, PciProjectTrainingJobService) {
    this.$translate = $translate;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
  }

  $onInit() {
    this.isLoading = false;
  }

  goBack() {
    if (this.previousState === 'info') {
      this.goToJobInfo();
    } else {
      this.goToJobs();
    }
  }

  onDeleteJobConfirmClick() {
    this.isLoading = true;
    return this.PciProjectTrainingJobService.removeJob(
      this.projectId,
      this.jobId,
    )
      .then(() => {
        return this.goToJobs(
          this.$translate.instant(
            'pci_projects_project_training_jobs_delete_job_action_delete_success',
          ),
        );
      })
      .catch((error) => {
        return this.goToJobs(
          this.$translate.instant(
            'pci_projects_project_training_jobs_delete_job_action_delete_fail',
            {
              name: this.job.spec.name,
              message: error.data.message,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
