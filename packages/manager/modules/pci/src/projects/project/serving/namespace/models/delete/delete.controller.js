import get from 'lodash/get';

export default class PciServingNamespaceModelsDeleteController {
  /* @ngInject */
  constructor($translate, OvhManagerPciServingModelsService, atInternet) {
    this.$translate = $translate;
    this.OvhManagerPciServingModelsService = OvhManagerPciServingModelsService;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteModel() {
    this.atInternet.trackClick({
      name: 'public-cloud::pci::projects::project::serving::delete::submit',
      type: 'action',
    });
    this.isDeleting = true;
    return this.OvhManagerPciServingModelsService.delete(
      this.projectId,
      this.namespaceId,
      { id: this.modelId },
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_serving_namespace_models_delete_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_serving_namespace_models_delete_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
