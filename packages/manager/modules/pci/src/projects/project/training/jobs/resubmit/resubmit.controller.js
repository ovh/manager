import get from 'lodash/get';

export default class PciTrainingJobsResubmitController {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loading = false;
  }

  confirmResubmitJob() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::jobs::resubmit::confirm',
      type: 'action',
    });

    this.loading = true;
    return this.resubmitJob()
      .then(() =>
        this.goToJobs(
          this.$translate.instant(
            'pci_projects_project_training_jobs_resubmit_success',
          ),
          'success',
        ),
      )
      .catch((error) =>
        this.goToJobs(
          this.$translate.instant(
            'pci_projects_project_training_jobs_resubmit_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }

  goBack() {
    if (this.previousState === 'info') {
      this.goToJobInfo();
    } else {
      this.goToJobs();
    }
  }

  getResubmitCliCommand() {
    return `job rerun ${this.job.id}`;
  }
}
