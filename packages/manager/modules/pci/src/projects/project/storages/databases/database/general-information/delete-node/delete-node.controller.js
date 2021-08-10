export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.deletingNode = false;
    this.name = this.database.description;
  }

  deleteNode() {
    this.trackDatabases('dashboard::general_information::add_node_validate');
    this.deletingNode = true;
    return this.DatabaseService.deleteNode(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.database.flavor,
      this.database.region,
    )
      .then((nodeInfo) =>
        this.onNodeDelete(
          nodeInfo,
          this.$translate.instant(
            'pci_databases_general_information_delete_node_success',
          ),
          'info',
        ),
      )
      .catch(() =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_delete_node_pending',
          ),
          'warning',
        ),
      );
  }

  cancel() {
    this.trackDatabases('dashboard::general_information::delete_node_cancel');
    this.goBack();
  }
}
