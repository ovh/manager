import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, NotebookService) {
    this.$translate = $translate;
    this.NotebookService = NotebookService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteNotebook() {
    this.trackNotebooks(`${this.trackingPrefix}::delete_notebook_confirm`);
    this.isDeleting = true;
    return this.NotebookService.removeNotebook(this.projectId, this.notebook.id)
      .then(() =>
        this.goBack(
          this.$translate.instant('pci_notebook_delete_notebook_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_notebook_delete_notebook_error', {
            notebookName: this.notebook.name,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackNotebooks(`${this.trackingPrefix}::delete_notebook_cancel`);
    this.goBack();
  }
}
