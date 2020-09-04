import get from 'lodash/get';

export default class PciTrainingDataSyncController {
  /* @ngInject */
  constructor(PciProjectTrainingDataService, $translate, atInternet) {
    this.PciProjectTrainingDataService = PciProjectTrainingDataService;
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.direction = 'from-object-storage';
  }

  sync() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::data::sync::confirm',
      type: 'action',
    });

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

  cliCommand() {
    return [
      'data',
      'sync',
      this.data,
      '\\\n\t',
      '--direction',
      this.direction,
    ].join(' ');
  }
}
