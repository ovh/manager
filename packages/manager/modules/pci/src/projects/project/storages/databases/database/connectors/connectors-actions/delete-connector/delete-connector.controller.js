export default class DeleteConnectorCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
  }

  $onInit() {
    this.trackDashboard(
      'connector_flows::actions_menu::delete_connector_flow',
      'page',
    );
  }

  cancel() {
    this.trackDashboard(
      'connector_flows::actions_menu::delete_connector_flow_cancel',
    );
    this.goBack();
  }

  deleteconnector() {
    this.processing = true;
    this.trackDashboard(
      'connector_flows::actions_menu::delete_connector_flow_confirm',
    );
    return this.DatabaseService.deleteConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.connector.id,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_connectors_delete_connector_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_connectors_delete_connector_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        ),
      );
  }
}
