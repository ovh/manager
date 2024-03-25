export default class PciTrainingJobsKillController {
  /* @ngInject */
  constructor($translate, atInternet, PciProjectTrainingJobService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
  }

  $onInit() {
    this.loading = false;
  }

  killJob() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::jobs::kill::confirm',
      type: 'action',
    });

    this.loading = true;
    return this.PciProjectTrainingJobService.killJob(this.projectId, this.jobId)
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_job_kill_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_job_kill_error',
            {
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
