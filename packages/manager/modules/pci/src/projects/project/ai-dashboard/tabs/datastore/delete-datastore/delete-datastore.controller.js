export default class AIDashboadDeleteDatastoreCtrl {
  /* @ngInject */
  constructor($translate, atInternet, AiDashboardService) {
    this.AiDashboardService = AiDashboardService;
    this.atInternet = atInternet;
    this.$translate = $translate;
  }

  deleteDatastore() {
    this.processing = true;
    return this.AiDashboardService.deleteDatastore(
      this.projectId,
      this.regionId,
      this.datastoreId,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_ai_dashboard_delete_datastore_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_ai_dashboard_delete_datastore_error_message',
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
