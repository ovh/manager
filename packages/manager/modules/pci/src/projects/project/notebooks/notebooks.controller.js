import capitalize from 'lodash/capitalize';
import find from 'lodash/find';
import get from 'lodash/get';

import { NOTEBOOK_STATUS } from './notebook.constants';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, CucRegionService, NotebookService) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.NotebookService = NotebookService;
  }

  $onInit() {
    this.messageContainer = 'pci.projects.project.notebooks';
    this.loadMessages();
    this.trackNotebooks('table', 'page');
    this.pollNotebookStatus();
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

  startNotebook(notebookId) {
    this.trackNotebooks('table::options_menu::start_notebook');
    const notebook = find(this.notebooks, { id: notebookId });
    this.NotebookService.startNotebook(this.projectId, notebookId).then(
      () => {
        notebook.setState(NOTEBOOK_STATUS.STARTING);
        this.pollNotebookStatus();
      },
      (error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_notebook_list_start_error', {
            notebookName: notebook.name,
            message: get(error, 'data.message'),
          }),
          this.messageContainer,
        );
      },
    );
  }

  stopNotebook(notebookId) {
    this.trackNotebooks('table::options_menu::pause_notebook');
    const notebook = find(this.notebooks, { id: notebookId });
    this.NotebookService.stopNotebook(this.projectId, notebookId).then(
      () => {
        notebook.setState(NOTEBOOK_STATUS.STOPPING);
        this.pollNotebookStatus();
      },
      (error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_notebook_list_stop_error', {
            notebookName: notebook.name,
            message: get(error, 'data.message'),
          }),
          this.messageContainer,
        );
      },
    );
  }

  $onDestroy() {
    this.stopPollingNotebookStatus();
  }
}
