import get from 'lodash/get';

export default class PciServingTrainingDashboardAttachRegistryController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;

    this.registry = {
      username: null,
      password: null,
      url: null,
    };
  }

  attachRegistry() {
    this.loading = true;

    this.saveRegistry(
      this.registry.url,
      this.registry.username,
      this.registry.password,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_dashboard_attach_registry_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_dashboard_attach_registry_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
