import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.addingNode = false;
    this.name = this.database.description;
  }

  addNode() {
    this.trackDatabases('dashboard::general_information::add_node_validate');
    this.addingNode = true;
    return this.DatabaseService.addNode(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.database.flavor,
      this.database.region,
    )
      .then((nodeInfo) =>
        this.onNodeAdd(
          nodeInfo,
          this.$translate.instant(
            'pci_databases_general_information_add_node_success',
          ),
          'info',
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_add_node_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDatabases('dashboard::general_information::add_node_cancel');
    this.goBack();
  }
}
