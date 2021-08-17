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
    this.trackDatabases('dashboard::general_information::remove_node_validate');
    this.deletingNode = true;
    this.nodeInfo = this.database.nodes[this.database.nodes.length - 1];
    return this.DatabaseService.deleteNode(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.nodeInfo.id,
    )
      .then(() =>
        this.onNodeDelete(
          this.nodeInfo,
          this.$translate.instant(
            'pci_databases_general_information_delete_node_pending',
          ),
          'info',
        ),
      )
      .catch(() =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_delete_node_error',
          ),
          'warning',
        ),
      );
  }

  cancel() {
    this.trackDatabases('dashboard::general_information::remove_node_cancel');
    this.goBack();
  }
}
