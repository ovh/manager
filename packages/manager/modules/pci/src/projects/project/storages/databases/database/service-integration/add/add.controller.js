export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
  }

  $onInit() {
    this.trackDashboard(`service_integration::add_${this.engineName}`, 'page');
  }

  cancel() {
    this.trackDashboard(`service_integration::add_${this.engineName}_cancel`);
    this.goBack();
  }

  addServiceIntegration() {
    this.processing = true;
    this.trackDashboard(`service_integration::add_${this.engineName}_confirm`);
    return this.DatabaseService.addIntegration(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.service,
    )
      .then(() => {
        this.trackDashboard(
          `service_integration::add_${this.engineName}_validate_banner`,
          'page',
        );
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_service_integration_add_success_message',
            {
              engineName: this.engineName,
            },
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard(
          `service_integration::add_${this.engineName}_error_banner`,
          'page',
        );
        return this.goBack(
          this.$translate.instant(
            'pci_databases_service_integration_add_error_message',
            {
              engineName: this.engineName,
              message: err.data?.message || null,
            },
          ),
          'error',
        );
      });
  }
}
