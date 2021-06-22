import get from 'lodash/get';
import Notebook from '../../../Notebook.class';

const START_NOTEBOOK_NAMESPACE = 'cloud.project.notebook.start';

export default class PciNotebookStartController {
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
    this.Poller.kill(START_NOTEBOOK_NAMESPACE);
  }

  waitNotebookStart() {
    const endPointUrl = this.NotebookService.constructor.buildGetNotebookUrl(
      this.projectId,
      this.notebookId,
    );

    return this.Poller.poll(endPointUrl, null, {
      interval: 1000,
      successRule(notebook) {
        return new Notebook(notebook, null, null).isRunning();
      },
      namespace: START_NOTEBOOK_NAMESPACE,
      notifyOnError: false,
    });
  }

  startNotebook() {
    this.isLoading = true;

    return this.NotebookService.startNotebook(this.projectId, this.notebookId)
      .then(() => this.waitNotebookStart())
      .then(() => {
        return this.goBack(
          this.$translate.instant('pci_notebooks_start_notebook_success', {
            notebook: this.notebook.name,
          }),
        );
      })
      .catch((err) => {
        return this.goBack(
          this.$translate.instant('pci_notebooks_start_notebook_error', {
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
