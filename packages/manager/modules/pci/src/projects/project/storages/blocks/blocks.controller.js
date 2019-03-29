export default class PciBlockStorageController {
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
    this.initLoaders();
  }

  initLoaders() {
    this.loading = true;
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getBlocks())
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
