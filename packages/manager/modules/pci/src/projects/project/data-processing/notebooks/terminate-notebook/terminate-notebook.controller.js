export default class {
  /* @ngInject */
  constructor(dataProcessingService) {
    this.dataProcessingService = dataProcessingService;
  }

  deleteNotebook() {
    this.trackNotebooks(`stop-notebook::stop-notebook-confirm`);
    return this.dataProcessingService
      .terminateNotebook(this.projectId, this.notebookId)
      .then(() => {
        this.goBack();
      });
  }

  closeModal() {
    this.trackNotebooks(`stop-notebook::stop-notebook-cancel`);
    this.goBack();
  }
}
