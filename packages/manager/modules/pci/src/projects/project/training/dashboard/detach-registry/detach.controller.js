import get from 'lodash/get';

export default class PciTrainingDashboardDetachRegistryController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;

    this.registry = {
      username: null,
      password: null,
      registry: null,
    };
  }

  detachRegistry() {
    this.loading = true;

    this.deleteRegistry()
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_dashboard_detach_registry_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_dashboard_detach_registry_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
