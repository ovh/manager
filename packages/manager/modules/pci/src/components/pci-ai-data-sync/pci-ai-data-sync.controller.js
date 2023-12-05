import { DATA_SYNC_TYPES } from './pci-ai-data-sync.constants';

export default class PciAiDataSyncCtrl {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    PciProjectAppService,
    PciProjectNotebookService,
    PciProjectJobService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.PciProjectAppService = PciProjectAppService;
    this.PciProjectNotebookService = PciProjectNotebookService;
    this.PciProjectJobService = PciProjectJobService;
  }

  $onInit() {
    this.dataSyncType = DATA_SYNC_TYPES;
    [this.currentDataSyncType] = this.dataSyncType;
  }

  syncData() {
    this.processing = true;
    const dataSyncParameters = {
      direction: this.currentDataSyncType,
      volume: this.volumeId,
    };
    return this.PciProjectAppService.dataSync(
      this.projectId,
      this.appId,
      dataSyncParameters,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_ai_apps_dashboard_data_sync_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_ai_apps_dashboard_data_sync_error_message',
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
