import { APP_DATA_SYNC_TYPES } from '../../../app.constants';

export default class AIAppsDataSyncCtrl {
  /* @ngInject */
  constructor($translate, atInternet, AppService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.AppService = AppService;
  }

  $onInit() {
    this.dataSyncType = APP_DATA_SYNC_TYPES;
    [this.currentDataSyncType] = this.dataSyncType;
  }

  syncData() {
    this.processing = true;
    const dataSyncParameters = {
      direction: this.currentDataSyncType,
      volume: this.volumeId,
    };
    return this.AppService.dataSync(
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
