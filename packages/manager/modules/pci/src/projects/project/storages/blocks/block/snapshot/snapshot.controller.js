import get from 'lodash/get';

export default class PciBlockStorageDetailchsSnapshotController {
  /* @ngInject */
  constructor(
    $filter,
    $translate,
    CucCloudMessage,
    PciProjectStorageBlockService,
  ) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.snapshot = {};
    this.priceEstimation = null;
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
        this.snapshot.name = `${this.storage.name} ${this.$filter('date')(new Date(), 'short')}`;
        return this.storage;
      })
      .then(() => this.PciProjectStorageBlockService
        .getSnapshotPriceEstimation(this.projectId, this.storage))
      .then((price) => {
        this.priceEstimation = price;
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_snapshot_error_load',
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
      this.CucCloudMessage.unSubscribe('pci.projects.project.storages.blocks.snapshot');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'pci.projects.project.storages.blocks.snapshot',
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

  createSnapshot() {
    this.loadings.save = true;
    return this.PciProjectStorageBlockService
      .createSnapshot(this.projectId, this.storage, this.snapshot)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_snapshot_success_message',
            {
              snapshot: this.snapshot.name,
            },
          ),
          'pci.projects.project.storages.blocks',
        );
        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_snapshot_error_delete',
            {
              message: get(err, 'data.message', null),
              snapshot: this.snapshot.name,
            },
          ),
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
