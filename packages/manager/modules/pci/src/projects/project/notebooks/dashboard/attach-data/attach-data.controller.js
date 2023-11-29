const DATAGRID_MAX_ITEMS_PER_PAGE = 10;

export default class {
  /* @ngInject */
  constructor(coreConfig, CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;

    this.DATAGRID_MAX_ITEMS_PER_PAGE = DATAGRID_MAX_ITEMS_PER_PAGE;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.notebooks.dashboard.attach-data';
    this.loadMessages();
    this.dataStoreVolumes = this.notebook.spec.volumes.filter(
      ({ dataStore }) => dataStore !== undefined,
    );
    this.publicGitVolumes = this.notebook.spec.volumes.filter(
      ({ publicGit }) => publicGit !== undefined,
    );
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  manualDataSync(volume) {
    if (volume) {
      const selectedVolume = this.notebook.status.volumes.find(
        (vol) => vol.mountPath === volume.mountPath,
      );
      this.goToManualDataSync(
        this.notebook.id,
        selectedVolume.id,
        selectedVolume.mountPath,
      );
    } else {
      this.goToManualDataSync(this.notebook.id);
    }
  }
}
