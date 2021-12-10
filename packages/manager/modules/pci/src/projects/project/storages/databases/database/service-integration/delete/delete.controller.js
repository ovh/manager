export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('service_integration::delete_kafka', 'page');
  }

  cancel() {
    this.trackDashboard('service_integration::delete_kafka_cancel');
    this.goBack();
  }

  deleteServiceIntegration() {
    this.trackDashboard('service_integration::delete_kafka_confirm');
    this.processing = true;
    return this.DatabaseService.deleteIntegration(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.integration,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_service_integration_delete_success_message',
            {
              integration: this.integration.serviceName,
            },
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_service_integration_delete_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        ),
      );
  }
}
