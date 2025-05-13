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
    this.isLoading = false;

    this.editStorage = new BlockStorage(
      pick(this.storage, [
        'id',
        'region',
        'type',
        'name',
        'size',
        'bootable',
        'planCode',
        'isLocalZone',
      ]),
    );
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.storages.blocks.block.edit',
    );
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

  edit() {
    this.isLoading = true;
    return this.PciProjectStorageBlockService.update(
      this.projectId,
      this.editStorage,
      this.storage,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_edit_success_message',
            { volume: this.editStorage.name },
          ),
        ),
      )
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_edit_error_put',
            {
              message: get(err, 'data.message', null),
              volume: this.editStorage.name,
            },
          ),
          'pci.projects.project.storages.blocks.block.edit',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
