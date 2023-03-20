export default class TerminateNotebookCtrl {
  /* @ngInject */
  constructor(dataProcessingService) {
    this.dataProcessingService = dataProcessingService;
    this.deleteNotebook = this.deleteNotebook.bind(this);
  }

  deleteNotebook() {
    return this.dataProcessingService
      .terminateNotebook(this.projectId, this.notebookId)
      .then(() => {
        this.goBack();
      });
  }

  closeModal() {
    this.goBack();
  }
}
