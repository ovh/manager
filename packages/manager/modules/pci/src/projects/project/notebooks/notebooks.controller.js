import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, CucRegionService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;

    this.capitalize = capitalize;
  }

  $onInit() {
    this.loadMessages();
    this.trackNotebooks('table', 'page');
    this.pollNotebookStatus();
  }

  $onDestroy() {
    this.stopPollingNotebookStatus();
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

  createNotebook() {
    this.trackNotebooks('table::create_notebook');
    this.goToAddNotebook();
  }

  goToNotebookDetails(notebook) {
    this.trackNotebooks('table::options_menu::details');
    this.goToNotebook(notebook);
  }

  deleteNotebook(notebook) {
    this.trackNotebooks('table::options_menu::delete_notebook');
    this.goToDeleteNotebook(notebook);
  }

  onGuideLinkClick(guideName) {
    this.trackNotebooks(`'table::guide::${guideName}`);
  }

  onNotebookStartClick(notebookId) {
    this.trackNotebooks('table::options_menu::start_notebook');
    return this.startNotebook(notebookId);
  }

  onNotebookStopClick(notebookId) {
    this.trackNotebooks('table::options_menu::pause_notebook');
    return this.stopNotebook(notebookId);
  }
}
