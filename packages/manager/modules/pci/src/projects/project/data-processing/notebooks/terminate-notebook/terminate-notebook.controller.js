export default class {
  /* @ngInject */
  constructor($state, dataProcessingService) {
    this.$state = $state;
    this.dataProcessingService = dataProcessingService;
    this.stopNotebook = this.stopNotebook.bind(this);
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
