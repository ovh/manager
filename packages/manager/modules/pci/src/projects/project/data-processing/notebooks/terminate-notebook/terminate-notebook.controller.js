export default class {
  /* @ngInject */
  constructor($state, dataProcessingService) {
    this.$state = $state;
    this.dataProcessingService = dataProcessingService;
    this.deleteNotebook = this.deleteNotebook.bind(this);
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
