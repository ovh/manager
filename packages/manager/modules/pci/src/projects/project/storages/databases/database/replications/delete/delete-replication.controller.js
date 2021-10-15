import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
  }

  $onInit() {
    this.trackDashboard(
      'replication_flows::actions_menu::delete_replication_flow',
      'page',
    );
  }

  cancel() {
    this.trackDashboard(
      'replication_flows::actions_menu::delete_replication_flow_cancel',
    );
    this.goBack();
  }

  deleteReplication() {
    this.processing = true;
    this.trackDashboard(
      'replication_flows::actions_menu::delete_replication_flow_confirm',
    );
    return this.DatabaseService.deleteReplication(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.replication.id,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_replications_delete_replication_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_replications_delete_replication_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
