import get from 'lodash/get';

export default class PciServingNamespaceInfosDetachRegistryController {
  /* @ngInject */
  constructor(
    $translate,
    OvhManagerPciServingRegistryService,
  ) {
    this.$translate = $translate;
    this.OvhManagerPciServingRegistryService = OvhManagerPciServingRegistryService;
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

    this.OvhManagerPciServingRegistryService.detach(this.projectId, this.namespaceId, this.registry)
      .then(() => this.goBack(
        this.$translate.instant('pci_projects_project_serving_namespace_infos_detach_registry_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('pci_projects_project_serving_namespace_infos_detach_registry_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }
}
