import get from 'lodash/get';

export default class PciTrainingDataSyncController {
  /* @ngInject */
  constructor(PciProjectTrainingDataService, $translate) {
    this.PciProjectTrainingDataService = PciProjectTrainingDataService;
    this.$translate = $translate;
  }

  $onInit() {
    this.direction = 'pull';
  }

  sync() {
    this.loading = true;
    return this.PciProjectTrainingDataService.sync(
      this.projectId,
      this.data,
      this.direction,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_data_sync_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_data_sync_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
