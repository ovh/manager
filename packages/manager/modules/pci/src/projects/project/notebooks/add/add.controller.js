export default class {
  /* @ngInject */
  constructor($translate, $q, CucCloudMessage, NotebookService) {
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.NotebookService = NotebookService;
  }

  $onInit() {
    this.messageContainer = 'pci.projects.project.notebooks.add';
    this.loadMessages();
    this.trackNotebooks('configuration', 'page');
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
