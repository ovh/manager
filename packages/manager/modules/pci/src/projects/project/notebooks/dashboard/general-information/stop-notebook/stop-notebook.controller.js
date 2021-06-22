import get from 'lodash/get';
import Notebook from '../../../Notebook.class';

const STOP_NOTEBOOK_NAMESPACE = 'cloud.project.notebook.stop';

export default class PciNotebookStopController {
  /* @ngInject */
  constructor($translate, NotebookService, Poller) {
    this.$translate = $translate;
    this.NotebookService = NotebookService;
    this.Poller = Poller;
  }

  $onInit() {
    this.isLoading = false;
  }

  $onDestroy() {
    this.Poller.kill(STOP_NOTEBOOK_NAMESPACE);
  }

  waitNotebookStop() {
    const endPointUrl = this.NotebookService.constructor.buildGetNotebookUrl(
      this.projectId,
      this.notebookId,
    );

    return this.Poller.poll(endPointUrl, null, {
      interval: 1000,
      successRule(notebook) {
        return new Notebook(notebook, null, null).isStopped();
      },
      namespace: STOP_NOTEBOOK_NAMESPACE,
      notifyOnError: false,
    });
  }

  stopNotebook() {
    this.isLoading = true;

    return this.NotebookService.stopNotebook(this.projectId, this.notebookId)
      .then(() => this.waitNotebookStop())
      .then(() => {
        return this.goBack(
          this.$translate.instant('pci_notebooks_stop_notebook_success', {
            notebook: this.notebook.name,
          }),
        );
      })
      .catch((err) => {
        return this.goBack(
          this.$translate.instant('pci_notebooks_stop_notebook_error', {
            message: get(err, 'data.message'),
            notebook: this.notebook.name,
          }),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
