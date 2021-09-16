import get from 'lodash/get';
import {
  NOTEBOOK_PRIVACY_SETTINGS,
  NOTEBOOK_RESOURCES,
} from './notebook.constants';

export default class NotebookAddController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, QuantumService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.QuantumService = QuantumService;

    // Stepper config object
    this.stepper = {
      notebookSettings: { name: 'notebook_settings', display: null },
      notebookPrivateSettings: {
        name: 'notebook_private_settings',
        display: null,
      },
      notebookResources: { name: 'notebook_resources', display: null },
      notebookReview: { name: 'notebook_review', display: null },
    };

    // Notebook model
    this.notebookModel = {
      name: '',
      labels: [],
      repositoryURL: '',
      mountPath: '',
      nbResources: NOTEBOOK_RESOURCES.NB_RESOURCES,
      volumes: [],
      selected: {
        editor: null,
        framework: {
          version: null,
          model: null,
        },
        privacy: NOTEBOOK_PRIVACY_SETTINGS.RESTRICTED,
        region: null,
        useCase: null,
        resource: {
          usage: NOTEBOOK_RESOURCES.STANDARD,
          flavor: null,
          flavorType: NOTEBOOK_RESOURCES.STANDARD_FLAVOR,
        },
      },
    };
  }

  static convertLabels(labels) {
    return labels.reduce(
      (accumulator, label) => ({ ...accumulator, [label.key]: label.value }),
      {},
    );
  }

  static buildResourceBody(flavor, nbResources) {
    const { resourcesPerUnit, gpuInformation } = flavor;
    const { cpu, ...restOfResources } = resourcesPerUnit;

    return {
      [flavor.type]: nbResources,
      flavor: flavor.id,
      ...restOfResources,
      ...gpuInformation,
    };
  }

  static buildVolumesBody(volumes, region) {
    return volumes.map((volume) => ({
      mountPath: volume.mountPath,
      permission: volume.permission,
      cache: false,
      privateSwift: {
        container: volume.container,
        region: region.name,
      },
    }));
  }

  static convertNotebookModel(notebookModel) {
    const { name, nbResources } = notebookModel;
    const { labels, volumes, selected } = notebookModel;
    const { editor, framework, region, resource, privacy } = selected;

    return {
      env: {
        editorId: editor.id,
        frameworkId: framework.model.id,
        frameworkVersion: framework.version.version,
      },
      labels: NotebookAddController.convertLabels(labels),
      name,
      region: region.name,
      resources: NotebookAddController.buildResourceBody(
        resource.flavor,
        nbResources,
      ),
      volumes: NotebookAddController.buildVolumesBody(volumes, region),
      unsecureHttp: NOTEBOOK_PRIVACY_SETTINGS.PUBLIC === privacy,
    };
  }

  $onInit() {
    this.messageContainer = 'pci.projects.project.quantum-computing.add';
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getConfigHeader(display) {
    if (display === false) {
      return this.$translate.instant(
        'pci_notebook_add_configuration_title_selected',
        {
          notebook: this.notebookModel.name,
          labelsLength: this.notebookModel.labels.length,
        },
      );
    }

    return this.$translate.instant('pci_notebook_add_configuration_title');
  }

  getEditorHeader(display) {
    if (display === false) {
      return this.$translate.instant('pci_notebook_add_editor_title_selected', {
        editor: this.notebookModel.selected.editor.name,
      });
    }

    return this.$translate.instant('pci_notebook_add_editor_title');
  }

  getFrameworkHeader(display) {
    if (display === false) {
      return this.$translate.instant(
        'pci_notebook_add_framework_title_selected',
        {
          framework: this.notebookModel.selected.framework.model.name,
          version: this.notebookModel.selected.framework.version.version,
        },
      );
    }

    return this.$translate.instant('pci_notebook_add_framework_title');
  }

  getPrivacyHeader(display) {
    if (display === false) {
      const privacy = this.$translate.instant(
        `pci_notebook_add_privacy_settings_item_selected_${this.notebookModel.selected.privacy}`,
      );
      return this.$translate.instant(
        `pci_notebook_add_privacy_settings_title_selected`,
        {
          privacy,
        },
      );
    }

    return this.$translate.instant('pci_notebook_add_privacy_settings_title');
  }

  getRegionHeader(display) {
    if (display === false) {
      return this.$translate.instant(
        'pci_notebook_add_privacy_datacenter_location_title_selected',
        {
          region: this.notebookModel.selected.region.name,
        },
      );
    }

    return this.$translate.instant(
      'pci_notebook_add_privacy_datacenter_location_title',
    );
  }

  getResourceHeader(display) {
    if (display === false) {
      return this.$translate.instant(
        'pci_notebook_add_resources_title_selected',
        {
          flavor: this.notebookModel.selected.resource.flavor.id,
          quantity: this.notebookModel.nbResources,
        },
      );
    }

    return this.$translate.instant('pci_notebook_add_resources_title');
  }

  getAttachContainerHeader(display) {
    if (display === false) {
      return this.$translate.instant('pci_notebook_add_attach_title_selected', {
        quantity: this.notebookModel.volumes.length,
      });
    }

    return this.$translate.instant('pci_notebook_add_attach_title');
  }

  onRegionChange({ name: regionName }) {
    this.flavorsAreLoaded = false;
    this.QuantumService.getFlavors(this.projectId, regionName)
      .then((flavors) => {
        this.flavors = flavors;
        return this.QuantumService.getStorages(this.projectId);
      })
      .then((storages) => {
        this.storages = storages.filter(({ region }) => region === regionName);

        if (this.storages.length === 0) {
          this.notebookModel.volumes = [];
        }

        this.flavorsAreLoaded = true;
      })
      .catch((error) => this.CucCloudMessage.error(get(error, 'data.message')));
  }

  onNotebookSubmit() {
    const { selected, nbResources } = this.notebookModel;
    const { editor, framework, resource } = selected;
    const flavorName = resource.flavor.name;

    this.trackQuantumComputing(`config_create_notebook::${editor.id}`);
    this.trackQuantumComputing(
      'PublicCloud_create_new_notebook::'
        .concat(`${editor.id}::${framework.model.id}::`)
        .concat(`${resource.usage}_${flavorName}_${nbResources}`),
      undefined,
      false,
    );

    this.isAdding = true;
    return this.QuantumService.addNotebook(
      this.projectId,
      NotebookAddController.convertNotebookModel(this.notebookModel),
    )
      .then(() =>
        this.goToQuantumComputing(
          this.$translate.instant('pci_notebook_add_notebook_create_success'),
        ).then(() =>
          this.trackQuantumComputing(
            `config_create_notebook_validated::${editor.id}`,
          ),
        ),
      )
      .catch((error) => {
        this.trackQuantumComputing(
          `config_create_notebook_error::${editor.id}`,
        );
        this.CucCloudMessage.error(
          this.$translate.instant('pci_notebook_add_notebook_create_error', {
            message: get(error, 'data.message'),
          }),
        );
      })
      .finally(() => {
        this.isAdding = false;
      });
  }
}
