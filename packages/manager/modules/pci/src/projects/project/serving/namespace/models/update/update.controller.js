import get from 'lodash/get';

export default class PciServingNamespaceModelsUpdateController {
  /* @ngInject */
  constructor(
    $translate,
    OvhManagerPciServingModelsService,
  ) {
    this.$translate = $translate;
    this.OvhManagerPciServingModelsService = OvhManagerPciServingModelsService;
  }

  $onInit() {
    this.isUpdating = false;
  }

  updateModel() {
    this.isUpdating = true;
    return this.OvhManagerPciServingModelsService.update(
      this.projectId,
      this.namespaceId,
      this.modelId,
    )
      .then(() => this.goBack(
        this.$translate.instant('pci_projects_project_serving_namespace_models_update_success'),
      ))
      .catch((error) => this.goBack(
        this.$translate.instant('pci_projects_project_serving_namespace_models_update_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }
}
