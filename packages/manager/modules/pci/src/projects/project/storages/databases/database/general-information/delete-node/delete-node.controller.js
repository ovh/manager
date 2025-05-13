import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.deletingNode = false;
    this.name = this.database.description;
    this.trackDashboard('general_information::remove_node', 'page');
  }

  deleteNode() {
    this.trackDashboard('general_information::remove_node_validate');
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
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_delete_node_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'warning',
        ),
      );
  }

  cancel() {
    this.trackDashboard('general_information::remove_node_cancel');
    this.goBack();
  }
}
