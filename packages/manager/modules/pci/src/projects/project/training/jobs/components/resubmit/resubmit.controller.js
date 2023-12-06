export default class PciTrainingJobsResubmitController {
  /* @ngInject */
  constructor($translate, atInternet, PciProjectTrainingJobService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
  }

  $onInit() {
    this.loading = false;
  }

  resubmitJob() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::jobs::resubmit::confirm',
      type: 'action',
    });

    this.loading = true;
    return this.PciProjectTrainingJobService.resubmit(
      this.projectId,
      this.job.spec,
    )
      .then(() => {
        return this.goToJobs(
          this.$translate.instant(
            'pci_projects_project_training_jobs_resubmit_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_jobs_resubmit_error',
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

  getResubmitCliCommand() {
    return `job rerun ${this.job.id}`;
  }
}
