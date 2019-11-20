import get from 'lodash/get';

export default class PciServingNamespaceModelsDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    ovhManagerPciServing,
  ) {
    this.$translate = $translate;
    this.ovhManagerPciServing = ovhManagerPciServing;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteNamespace() {
    this.isDeleting = true;
    return this.ovhManagerPciServing.delete(
      this.projectId,
      { id: this.namespaceId },
    )
      .then(() => this.goBack(
        this.$translate.instant('pci_projects_project_serving_namespace_models_delete_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('pci_projects_project_serving_namespace_models_delete_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }
}
