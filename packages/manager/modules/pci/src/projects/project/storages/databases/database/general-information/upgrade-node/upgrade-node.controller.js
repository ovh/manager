import get from 'lodash/get';
import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.selectedFlavor = this.currentFlavor;
    this.upgradingFlavor = false;
    this.trackDatabases('config_upgrade_node', 'page');
  }

  onFlavorSelect(selectedFlavor) {
    this.trackDatabases(`config_upgrade_node::select_${selectedFlavor.name}`);
    this.trackDatabases(
      `PublicCloud::databases_upgrade_node_selection::${this.currentFlavor.name}::${selectedFlavor.name}`,
      'action',
      false,
    );
  }

  upgradeNode() {
    this.trackDashboard('general_information::popin_upgrade_node_validate');
    this.upgradingFlavor = true;
    return this.DatabaseService.editDatabase(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.database.description,
      this.database.plan,
      this.database.version,
      this.selectedFlavor.name,
    )
      .then((databaseInfo) => {
        this.database.updateData(databaseInfo);
        return this.onNodeUpgrade(
          this.$translate.instant(
            'pci_databases_general_information_upgrade_node_success',
          ),
          'info',
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_upgrade_node_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDashboard('general_information::popin_upgrade_node_cancel');
    this.goBack();
  }
}
