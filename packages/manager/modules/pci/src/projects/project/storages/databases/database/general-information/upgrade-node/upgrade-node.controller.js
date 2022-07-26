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

    this.database.diskSize = 700;
    this.diskSize = this.database.diskSize;
  }

  onFlavorSelect(selectedFlavor) {
    this.trackDatabases(`config_upgrade_node::select_${selectedFlavor.name}`);
    this.trackDatabases(
      `PublicCloud::databases_upgrade_node_selection::${this.currentFlavor.name}::${selectedFlavor.name}`,
      'action',
      false,
    );
  }

  get isButtonDisabled() {
    return (
      !this.selectedFlavor ||
      (this.selectedFlavor === this.currentFlavor &&
        this.diskSize === this.database.diskSize)
    );
  }

  upgradeNode() {
    this.trackDashboard('general_information::popin_upgrade_node_validate');
    this.upgradingFlavor = true;
    return this.DatabaseService.editDatabase(
      this.projectId,
      this.database.engine,
      this.database.id,
      {
        flavor: this.selectedFlavor.name,
        diskSize: this.diskSize,
      },
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

  getPrice() {
    const flavorPrice =
      this.selectedFlavor.hourlyPrice.priceInUcents * this.database.nodeNumber;
    const additionalStoragePrice =
      ((this.database.diskSize - this.selectedFlavor.minDiskSize) / 10) *
      this.selectedFlavor.additionalStorageHourlyPrice.priceInUcents *
      this.database.nodeNumber;
    return flavorPrice + additionalStoragePrice;
  }

  getTax() {
    const flavorTax =
      this.selectedFlavor.hourlyPrice.tax * this.database.nodeNumber;
    const additionalStorageTax =
      ((this.database.diskSize - this.selectedFlavor.minDiskSize) / 10) *
      this.selectedFlavor.additionalStorageHourlyPrice.tax *
      this.database.nodeNumber;
    return flavorTax + additionalStorageTax;
  }

  cancel() {
    this.trackDashboard('general_information::popin_upgrade_node_cancel');
    this.goBack();
  }
}
