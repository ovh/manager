export default class TerminatenotebookCtrl {
  /* @ngInject */
  constructor(dataProcessingService) {
    this.dataProcessingService = dataProcessingService;
  }

  stopNotebook() {
    return this.dataProcessingService
      .stopNotebook(this.projectId, this.notebookId)
      .then(() => {
        this.goBack();
      });
  }

  closeModal() {
    this.goBack();
  }
}
