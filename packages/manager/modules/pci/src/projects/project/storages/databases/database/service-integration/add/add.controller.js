export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
  }

  $onInit() {
    this.trackDashboard('service_integration::add_kafka', 'page');
  }

  cancel() {
    this.trackDashboard('service_integration::add_kafka_cancel');
    this.goBack();
  }

  addServiceIntegration() {
    this.processing = true;
    this.trackDashboard('service_integration::add_kafka_confirm');
    return this.DatabaseService.addIntegration(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.service,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_service_integration_add_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_service_integration_add_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        ),
      );
  }
}
