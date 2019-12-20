import get from 'lodash/get';

import { PRESET_IMAGE, BUILD_IMAGE } from './add.constants';

export default class PciServingNamespaceModelsAddController {
  /* @ngInject */
  constructor(
    $translate,
    OvhManagerPciServingModelsService,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.OvhManagerPciServingModelsService = OvhManagerPciServingModelsService;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.PRESET_IMAGE = PRESET_IMAGE;
    this.BUILD_IMAGE = BUILD_IMAGE;
  }

  $onInit() {
    this.isAdding = false;

    this.model = {
      id: null,
      storagePath: null,
      flavor: null,
      workflowTemplate: null,
      imageId: null,
    };

    [this.model.flavor] = this.flavors;

    this.workflowTemplates = [
      this.BUILD_IMAGE,
      this.PRESET_IMAGE,
    ];

    this.paths = [];
    this.getContainerFiles();
  }

  getContainerFiles() {
    this.PciProjectStorageContainersService.getContainer(
      this.projectId, this.namespace.containerId,
    ).then((container) => {
      this.paths = container.objects.map(({ name }) => {
        const split = name.split('/');
        split.pop();
        return split.join('/');
      }).filter(path => path !== '');
    });
  }

  addModel() {
    this.isAdding = true;

    this.OvhManagerPciServingModelsService.add(this.projectId, this.namespaceId, {
      id: this.model.id,
      storagePath: this.model.storagePath,
      flavor: this.model.flavor.id,
      workflowTemplate: this.model.workflowTemplate,
      imageId: get(this.model.imageId, 'id'),
    }).then(() => this.goBack(
      this.$translate.instant('pci_projects_project_serving_namespace_models_add_success'),
    ))
      .catch(error => this.goBack(
        this.$translate.instant('pci_projects_project_serving_namespace_models_add_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }
}
