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
    this.privateSwiftVolumes = this.notebook.spec.volumes.filter(
      ({ privateSwift }) => privateSwift !== undefined,
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
}
