import get from 'lodash/get';

export default class PciNotebooksStopNotebookController {
  /* @ngInject */
  constructor($translate, NotebookService) {
    this.$translate = $translate;
    this.NotebookService = NotebookService;
  }

  $onInit() {
    this.isLoading = false;
  }

  onStopNotebookConfirmClick() {
    this.trackNotebooks(`${this.trackingPrefix}::stop_notebook_confirm`);

    this.isLoading = true;
    return this.NotebookService.stopNotebook(this.projectId, this.notebook.id)
      .then(() => {
        return this.goBack(
          this.$translate.instant('pci_notebooks_stop_notebook_success'),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant('pci_notebooks_stop_notebook_error', {
            notebook: this.notebook.name,
            message: get(error, 'data.message'),
          }),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onStopNotebookCancelClick() {
    this.trackNotebooks(`${this.trackingPrefix}::stop_notebook_cancel`);
    return this.goBack();
  }
}
