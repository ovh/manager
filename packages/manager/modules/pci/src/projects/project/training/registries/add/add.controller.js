import get from 'lodash/get';

export default class PciServingTrainingRegistriesAddRegistryController {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loading = false;

    this.registry = {
      username: null,
      password: null,
      url: null,
    };
  }

  addRegistry() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::registries::add::confirm',
      type: 'action',
    });

    this.loading = true;

    this.saveRegistry({
      username: this.registry.username,
      password: this.registry.password,
      url: this.registry.url,
      region: this.registry.region.name,
    })
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_registries_add_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_registries_add_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
