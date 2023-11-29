import { NOTEBOOK_DATA_SYNC_TYPES } from '../../../notebook.constants';

export default class NotebooksDataSyncCtrl {
  /* @ngInject */
  constructor($translate, atInternet, NotebookService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.NotebookService = NotebookService;
  }

  $onInit() {
    this.dataSyncType = NOTEBOOK_DATA_SYNC_TYPES;
    [this.currentDataSyncType] = this.dataSyncType;
  }

  syncData() {
    this.processing = true;
    const dataSyncParameters = {
      direction: this.currentDataSyncType,
      volume: this.volumeId,
    };
    return this.NotebookService.dataSync(
      this.projectId,
      this.notebookId,
      dataSyncParameters,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_notebooks_dashboard_data_sync_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_notebooks_dashboard_data_sync_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        ),
      );
  }

  cancel() {
    this.goBack();
  }
}
