import get from 'lodash/get';

export default class PciNotebookNotebookDeleteAddController {
  /* @ngInject */
  constructor($translate, QuantumService) {
    this.$translate = $translate;
    this.QuantumService = QuantumService;
  }

  $onInit() {
    this.isLoading = false;
  }

  onDeleteNotebookConfirmClick() {
    this.trackQuantumComputing('dashboard::delete_notebook_confirm');

    this.isLoading = true;
    return this.QuantumService.removeNotebook(this.projectId, this.notebook.id)
      .then(() => {
        return this.goToQuantumComputing(
          this.$translate.instant(
            'pci_quantum_computing_notebooks_general_information_info_delete_notebook_action_delete_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'pci_quantum_computing_notebooks_general_information_info_delete_notebook_action_delete_fail',
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
    this.trackQuantumComputing('dashboard::delete_notebook_cancel');
    return this.goBack();
  }
}
