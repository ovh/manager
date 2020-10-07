import get from 'lodash/get';

export default class PciTrainingRegistriesDeleteController {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    console.log(this.registryId);
    this.loading = false;
  }

  deleteRegistryConfirm() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::registries::delete::confirm',
      type: 'action',
    });

    this.loading = true;

    this.deleteRegistry(this.registryId)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_registries_delete_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_registries_delete_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
