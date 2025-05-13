export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard(
      `service_integration::delete_${this.database.engine}`,
      'page',
    );
  }

  cancel() {
    this.trackDashboard(
      `service_integration::delete_${this.database.engine}_cancel`,
    );
    this.goBack();
  }

  deleteServiceIntegration() {
    this.trackDashboard(
      `service_integration::delete_${this.database.engine}_confirm`,
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
          `service_integration::delete_${this.database.engine}_validate_banner`,
          'page',
        );
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_service_integration_delete_success_message',
            {
              integrationType: this.integration.type,
            },
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard(
          `service_integration::delete_${this.database.engine}_error_banner`,
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
