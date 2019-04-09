import get from 'lodash/get';

export default class PciBlockStorageController {
  /* @ngInject */
  constructor(
    $rootScope,
    $translate,
    CucCloudMessage,
    PciProjectStorageBlockService,
  ) {
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.$rootScope.$on('pci_storages_blocks_refresh', () => this.refreshBlocks());
    this.initLoaders();
  }

  initLoaders() {
    this.loading = true;
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getBlocks())
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_blocks_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  getBlocks() {
    return this.PciProjectStorageBlockService
      .getAll(this.projectId)
      .then((storages) => {
        this.storages = storages;
        return this.storages;
      });
  }

  refreshBlocks() {
    this.loading = true;
    return this.getBlocks()
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_blocks_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.blocks');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.blocks',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
