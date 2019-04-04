import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

export default class PciBlockStorageDetailsAttachController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciProjectStorageBlockService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.loadings = {
      init: false,
      save: false,
    };

    return this.initLoaders();
  }

  initLoaders() {
    this.loadings.init = true;
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.PciProjectStorageBlockService.get(this.projectId, this.storageId))
      .then((storage) => {
        this.storage = storage;
        return this.PciProjectStorageBlockService
          .getCompatiblesInstances(this.projectId, this.storage);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_attach_error_load',
            { message: get(err, 'data.message', '') },
          ),
        );
      })
      .then((instances) => {
        this.instances = instances;
        this.instancesList = map(
          this.instances,
          ({ id, name }) => ({ id, name }),
        );
      })
      .finally(() => {
        this.loadings.init = false;
      });
  }

  loadMessages() {
    return new Promise((resolve) => {
      this.CucCloudMessage.unSubscribe('pci.projects.project.storages.blocks.attach');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'pci.projects.project.storages.blocks.attach',
        {
          onMessage: () => this.refreshMessages(),
        },
      );
      resolve();
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  attachStorage({ id, name: instanceName }) {
    this.loadings.save = true;
    const instance = find(this.instances, { id });

    return this.PciProjectStorageBlockService
      .attachTo(this.projectId, this.storage, instance)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_attach_success_message',
            {
              volume: this.storage.name,
              instance: instanceName,
            },
          ),
          'pci.projects.project.storages.blocks',
        );
        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_attach_error_attach',
            {
              message: get(err, 'data.message', null),
            },
          ),
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
