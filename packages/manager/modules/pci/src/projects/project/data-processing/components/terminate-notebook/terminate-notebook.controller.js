export default class TerminatenotebookCtrl {
  /* @ngInject */
  constructor(dataProcessingService) {
    this.dataProcessingService = dataProcessingService;
  }

  stopNotebook() {
    this.trackNotebooks(`stop-notebook::confirm`);
    return this.dataProcessingService
      .stopNotebook(this.projectId, this.notebookId)
      .then(() => {
        this.goBack();
      });
  }

  closeModal() {
    this.trackNotebooks(`stop-notebook::cancel`);
    this.goBack();
  }
}
