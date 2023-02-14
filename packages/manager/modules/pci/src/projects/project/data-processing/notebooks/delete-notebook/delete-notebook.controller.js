export default class DeleteNotebookCtrl {
  /* @ngInject */
  constructor(dataProcessingService) {
    this.dataProcessingService = dataProcessingService;
    this.deleteNotebook = this.deleteNotebook.bind(this);
  }

  deleteNotebook() {
    this.trackNotebooks(`delete-notebook::delete-notebook-confirm`);
    return this.dataProcessingService
      .deleteNotebook(this.projectId, this.notebookId)
      .then(() => {
        this.goBack();
      });
  }

  closeModal() {
    this.trackNotebooks(`delete-notebook::delete-notebook-cancel`);
    this.goBack();
  }
}
