import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, ovhManagerRegionService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;

    this.capitalize = capitalize;
  }

  $onInit() {
    this.loadMessages();
    this.trackQuantumComputing('table', 'page');
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
    this.trackQuantumComputing('table::create_notebook');
    this.goToAddNotebook();
  }

  goToNotebookDetails(notebook) {
    this.trackQuantumComputing('table::options_menu::details');
    this.goToNotebook(notebook);
  }

  deleteNotebook(notebook) {
    this.trackQuantumComputing('table::options_menu::delete_notebook');
    this.goToDeleteNotebook(notebook);
  }

  onGuideLinkClick(guideName) {
    this.trackQuantumComputing(`'table::guide::${guideName}`);
  }

  onNotebookStartClick(notebookId) {
    this.trackQuantumComputing('table::options_menu::start_notebook');
    return this.startNotebook(notebookId);
  }

  onNotebookStopClick(notebookId) {
    this.trackQuantumComputing('table::options_menu::pause_notebook');
    return this.stopNotebook(notebookId);
  }
}
