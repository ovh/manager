import get from 'lodash/get';

export default class PciNotebookNotebookDeleteAddController {
  /* @ngInject */
  constructor($translate, NotebookService) {
    this.$translate = $translate;
    this.NotebookService = NotebookService;
  }

  $onInit() {
    this.isLoading = false;
  }

  onDeleteNotebookConfirmClick() {
    this.trackNotebooks('dashboard::delete_notebook_confirm');

    this.isLoading = true;
    return this.NotebookService.removeNotebook(this.projectId, this.notebook.id)
      .then(() => {
        return this.goToNotebooks(
          this.$translate.instant(
            'pci_notebooks_general_information_info_delete_notebook_action_delete_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'pci_notebooks_general_information_info_delete_notebook_action_delete_fail',
            {
              name: this.notebook.name,
              message: get(error, 'data.message'),
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onDeleteNotebookCancelClick() {
    this.trackNotebooks('dashboard::delete_notebook_cancel');
    return this.goBack();
  }
}
