import get from 'lodash/get';

import { PRESET_IMAGE, BUILD_IMAGE } from './add.constants';

const EXTENSION = ['.h5', '.onnx', '.pmml'];

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
    this.FOLDER_MODE = 'folder';
    this.FILE_MODE = 'file';
    this.mode = this.FOLDER_MODE;

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

    this.folders = [];
    this.files = [];
    this.getContainerFiles();
  }

  getContainerFiles() {
    this.containerLoading = true;
    this.PciProjectStorageContainersService.getContainer(
      this.projectId, this.namespace.containerId,
    ).then((container) => {
      this.folders = container.objects.map(({ name }) => {
        const split = name.split('/');
        split.pop();
        return split.join('/');
      }).filter((path) => path !== '');

      this.files = container.objects.map(({ name }) => name).filter((path) => {
        for (let i = 0; i < EXTENSION.length; i += 1) {
          if (path.endsWith(EXTENSION[i])) {
            return true;
          }
        }
        return false;
      });
    }).finally(() => {
      this.containerLoading = false;
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
      .catch((error) => this.goBack(
        this.$translate.instant('pci_projects_project_serving_namespace_models_add_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }

  resetMode() {
    this.model.storagePath = null;
  }
}
