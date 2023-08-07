export default class PciTrainingDeleteController {
  /* @ngInject */
  constructor($translate, PciProjectTrainingJobService) {
    this.$translate = $translate;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
  }

  $onInit() {
    this.isLoading = false;
  }

  onDeleteJobConfirmClick() {
    this.isLoading = true;
    return this.PciProjectTrainingJobService.removeJob(
      this.projectId,
      this.jobId,
    )
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_delete_job_action_delete_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_delete_job_action_delete_fail',
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
