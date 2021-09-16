import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, QuantumService) {
    this.$translate = $translate;
    this.QuantumService = QuantumService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteNotebook() {
    this.trackQuantumComputing(
      `${this.trackingPrefix}::delete_notebook_confirm`,
    );
    this.isDeleting = true;
    return this.QuantumService.removeNotebook(this.projectId, this.notebook.id)
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
    this.trackQuantumComputing(
      `${this.trackingPrefix}::delete_notebook_cancel`,
    );
    this.goBack();
  }
}
