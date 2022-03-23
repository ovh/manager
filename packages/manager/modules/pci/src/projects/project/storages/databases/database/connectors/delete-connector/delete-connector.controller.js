export default class DeleteConnectorCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
  }

  $onInit() {
    this.trackDashboard('connectors::delete_connector', 'page');
  }

  cancel() {
    this.trackDashboard('connectors::actions_menu::delete_cancel');
    this.goBack();
  }

  deleteconnector() {
    this.processing = true;
    this.trackDashboard('connectors::actions_menu::delete_confirm');
    return this.DatabaseService.deleteConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.connector.id,
    )
      .then(() => {
        this.trackDashboard('connectors::delete_connector_validate', 'page');
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_connectors_delete_connector_success_message',
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard('connectors::delete_connector_error', 'page');
        this.goBack(
          this.$translate.instant(
            'pci_databases_connectors_delete_connector_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        );
      });
  }
}
