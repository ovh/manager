export default class {
  /* @ngInject */
  constructor($state, dataProcessingService) {
    this.$state = $state;
    this.dataProcessingService = dataProcessingService;
    this.deleteNotebook = this.deleteNotebook.bind(this);
  }

  deleteNotebook() {
    return this.dataProcessingService
      .deleteNotebook(this.projectId, this.notebookId)
      .then(() => {
        this.goBack();
      });
  }

  closeModal() {
    this.goBack();
  }
}
