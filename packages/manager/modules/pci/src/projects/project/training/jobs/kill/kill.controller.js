import get from 'lodash/get';

export default class PciTrainingJobsKillController {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loading = false;
  }

  confirmKillJob() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::jobs::kill::confirm',
      type: 'action',
    });

    this.loading = true;
    return this.killJob()
      .then(() =>
        this.goToJobs(
          this.$translate.instant(
            'pci_projects_project_training_job_kill_success',
          ),
          'success',
        ),
      )
      .catch((error) =>
        this.goToJobs(
          this.$translate.instant(
            'pci_projects_project_training_job_kill_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  goBack() {
    if (this.previousState && this.previousState === 'info') {
      this.goToJobInfo();
    } else {
      this.goToJobs();
    }
  }
}
