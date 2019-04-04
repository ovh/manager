import get from 'lodash/get';

export default class PciBlockStorageDetailsDetachController {
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
        return this.storage;
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_detach_error_load',
            { message: get(err, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loadings.init = false;
      });
  }

  loadMessages() {
    return new Promise((resolve) => {
      this.CucCloudMessage.unSubscribe('pci.projects.project.storages.blocks.detach');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'pci.projects.project.storages.blocks.detach',
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

  detachStorage() {
    this.CucCloudMessage.flushChildMessage('pci.projects.project.storages.blocks');

    this.loadings.save = true;
    return this.PciProjectStorageBlockService
      .detach(this.projectId, this.storage)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_detach_success_message',
            {
              volume: this.storage.name,
            },
          ),
          'pci.projects.project.storages.blocks',
        );
        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_detach_error_delete',
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
