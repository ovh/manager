export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, CucRegionService, NotebookService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.NotebookService = NotebookService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.notebooks.dashboard.general-information';
    this.loadMessages();
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
