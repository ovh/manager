import get from 'lodash/get';
import {
  NOTEBOOK_PRIVACY_SETTINGS,
  NOTEBOOK_RESOURCES,
} from './notebook.constants';

export default class NotebookAddController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, NotebookService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.NotebookService = NotebookService;

    // Stepper config object
    this.stepper = {
      notebookSshKeys: { name: 'notebook_ssh_keys', display: null },
      notebookSettings: { name: 'notebook_settings', display: null },
      notebookEditors: { name: 'notebook_editors', display: null },
      notebookFrameworks: { name: 'notebook_frameworks', display: null },
      notebookPrivateSettings: {
        name: 'notebook_private_settings',
        display: null,
      },
      notebookDatacenterLocation: {
        name: 'notebook_datacenter_location',
        display: null,
      },
      notebookResources: { name: 'notebook_resources', display: null },
      notebookAttach: { name: 'notebook_attach', display: null },
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
      sshPublicKeys: [],
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

  static buildVolumesBody(volumes) {
    return volumes.map((volume) => {
      if (volume.container !== undefined) {
        return {
          mountPath: volume.mountPath,
          permission: volume.permission,
          cache: volume.cache,
          dataStore: {
            container: volume.container.name,
            alias: volume.container.region,
            prefix: volume.prefix,
          },
        };
      }
      return {
        mountPath: volume.mountPath,
        permission: volume.permission,
        cache: volume.cache,
        publicGit: {
          url: volume.gitUrl,
        },
      };
    });
  }

  static convertNotebookModel(notebookModel) {
    const { name, nbResources } = notebookModel;
    const { labels, volumes, selected, sshPublicKeys } = notebookModel;
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
      volumes: NotebookAddController.buildVolumesBody(volumes),
      unsecureHttp: NOTEBOOK_PRIVACY_SETTINGS.PUBLIC === privacy,
      sshPublicKeys,
    };
  }

  $onInit() {
    this.messageContainer = 'pci.projects.project.notebooks.add';
    this.loadMessages();
    if (this.storages.length === 0) {
      this.notebookModel.volumes = [];
    }
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

  getSshKeysHeader(display) {
    if (display === false) {
      return this.$translate.instant('pci_notebook_add_ssh_keys_selected', {
        quantity: this.notebookModel.sshPublicKeys.length,
      });
    }

    return this.$translate.instant('pci_notebook_add_ssh_keys');
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
    this.NotebookService.getFlavors(this.projectId, regionName)
      .then((flavors) => {
        this.flavors = flavors;
        this.flavorsAreLoaded = true;
      })
      .catch((error) => this.CucCloudMessage.error(get(error, 'data.message')));
  }

  onNotebookSubmit() {
    const { selected, nbResources } = this.notebookModel;
    const { editor, framework, resource } = selected;
    const flavorId = resource.flavor.id;

    this.trackNotebooks(`config_create_notebook::${editor.id}`);
    this.trackNotebooks(
      'PublicCloud_create_new_notebook::'
        .concat(`${editor.id}::${framework.model.id}::`)
        .concat(`${resource.usage}_${flavorId}_${nbResources}`),
      undefined,
      false,
    );

    this.isAdding = true;
    return this.NotebookService.addNotebook(
      this.projectId,
      NotebookAddController.convertNotebookModel(this.notebookModel),
    )
      .then(() =>
        this.goToNotebooks(
          this.$translate.instant('pci_notebook_add_notebook_create_success'),
        ).then(() =>
          this.trackNotebooks(`config_create_notebook_validated::${editor.id}`),
        ),
      )
      .catch((error) => {
        this.trackNotebooks(`config_create_notebook_error::${editor.id}`);
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
