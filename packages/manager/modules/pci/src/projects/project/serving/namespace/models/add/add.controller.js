import get from 'lodash/get';

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
  }

  $onInit() {
    this.isAdding = false;

    this.model = {
      id: null,
      storagePath: null,
      flavor: null,
      kind: null,
      preset: null,
    };

    this.presets = [
      {
        id: '3b2c0bdf8b5349e8bafb79b76419b3f0',
        name: 'Text Sentiment Analysis',
        link: 'https://market-place.ai.ovh.net/#!/apis/3072602f-7adb-4398-b260-2f7adb2398f9/pages/ae10410c-a12c-495d-9041-0ca12ca95da6',
      },
      {
        id: '3b2c0bdf8b5349e8bafb79b76419b3f2',
        name: 'Text Sentiment Analysis 2',
        link: 'https://market-place.ai.ovh.net/#!/apis/3072602f-7adb-4398-b260-2f7adb2398f9/pages/ae10410c-a12c-495d-9041-0ca12ca95da6',
      },
    ];

    this.flavors = [
      {
        id: '3b2c0bdf8b5349e8bafb79b76419b3f0',
        name: 'Preview',
        type: 'CPU',
        infos: {

        },
        price: 0,
      },
    ];

    [this.model.flavor] = this.flavors;

    this.types = [
      'preset',
      'user',
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
