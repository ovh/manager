import get from 'lodash/get';

import { PRESET_IMAGE, BUILD_IMAGE } from './add.constants';

export default class PciServingNamespaceModelsAddController {
  /* @ngInject */
  constructor(
    $translate,
    OvhManagerPciServingModelsService,
    PciStoragesContainersService,
  ) {
    this.$translate = $translate;
    this.OvhManagerPciServingModelsService = OvhManagerPciServingModelsService;
    this.PciStoragesContainersService = PciStoragesContainersService;
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
    this.PciStoragesContainersService.getContainer(
      this.projectId, this.namespace.containerId,
    ).then((container) => {
      const result = {};
      container.objects.forEach(({ name }) => {
        const split = name.split('/');
        split.pop();
        const directory = split.join('/');
        result[directory] = true;
      });

      this.paths = Object.keys(result);
    });
  }

  addModel() {
    this.isAdding = true;

    this.OvhManagerPciServingModelsService.add(this.projectId, this.namespaceId, {
      id: this.model.id,
      storagePath: this.model.storagePath,
      flavor: this.model.flavor.id,
      workflowTemplate: this.model.workflowTemplate,
      imageId: this.model.imageId && this.model.imageId.id,
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
