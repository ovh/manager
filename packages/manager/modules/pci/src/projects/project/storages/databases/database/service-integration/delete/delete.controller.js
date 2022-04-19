export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard(
      `service_integration::delete_${this.engineName}`,
      'page',
    );
  }

  cancel() {
    this.trackDashboard(
      `service_integration::delete_${this.engineName}_cancel`,
    );
    this.goBack();
  }

  deleteServiceIntegration() {
    this.trackDashboard(
      `service_integration::delete_${this.engineName}_confirm`,
    );
    this.processing = true;
    return this.DatabaseService.deleteIntegration(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.integration,
    )
      .then(() => {
        this.trackDashboard(
          `service_integration::delete_${this.engineName}_validate_banner`,
          'page',
        );
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_service_integration_delete_success_message',
            {
              engineName: this.engineName,
              integration: this.integration.serviceName,
            },
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard(
          `service_integration::delete_${this.engineName}_error_banner`,
          'page',
        );
        return this.goBack(
          this.$translate.instant(
            'pci_databases_service_integration_delete_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        );
      });
  }
}
