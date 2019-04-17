import get from 'lodash/get';
import pick from 'lodash/pick';
import BlockStorage from '../../block.class';

export default class PciBlockStorageDetailsEditController {
  /* @ngInject */
  constructor(
    $translate,
    $q,
    $timeout,
    CucCloudMessage,
    PciProjectStorageBlockService,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.$timeout = $timeout;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.initLoaders();
  }

  initLoaders() {
    this.loading = true;

    this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getStorage())
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_edit_error_load',
            { message: get(err, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.blocks.block.edit');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.blocks.block.edit',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getStorage() {
    return this.PciProjectStorageBlockService
      .get(this.projectId, this.storageId)
      .then((storage) => {
        this.storage = storage;

        this.editStorage = new BlockStorage(
          pick(
            this.storage,
            [
              'id',
              'region',
              'type',
              'name',
              'size',
              'bootable',
              'planCode',
            ],
          ),
        );
        return this.editStorage;
      });
  }

  edit() {
    return this.PciProjectStorageBlockService
      .update(this.projectId, this.editStorage, this.storage)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_edit_success_message',
            { volume: this.editStorage.name },
          ),
          'pci.projects.project.storages.blocks',
        );

        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_edit_error_put',
            { message: get(err, 'data.message', null), volume: this.editStorage.name },
          ),
          'pci.projects.project.storages.blocks.block.edit',
        );
      });
  }
}
