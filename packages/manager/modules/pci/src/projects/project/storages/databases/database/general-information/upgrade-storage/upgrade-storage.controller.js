import get from 'lodash/get';
import capitalize from 'lodash/capitalize';

export default class UpgradeStorageCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.capitalize = capitalize;
  }

  $onInit() {
    this.trackDatabases('config_upgrade_storage', 'page');

    this.originallyAddedDiskSize =
      this.database.disk.size - this.flavor.minDiskSize;
    this.additionalDiskSize = this.originallyAddedDiskSize;

    const engine = this.engines.find(
      (engineObject) => engineObject.name === this.database.engine,
    );
    this.nbNodes = this.database.nodes.length;
    this.storageNodeFactor = engine.isDistributedStorage ? 1 : this.nbNodes;

    // compute initial price and tax
    this.initialPrice =
      this.nbNodes * this.flavor.hourlyPrice.priceInUcents +
      this.flavor.hourlyPricePerGB.priceInUcents *
        this.originallyAddedDiskSize *
        this.storageNodeFactor;

    this.initialTax =
      this.nbNodes * this.flavor.hourlyPrice.tax +
      this.flavor.hourlyPricePerGB.tax *
        this.originallyAddedDiskSize *
        this.storageNodeFactor;
  }

  get priceDelta() {
    const newPrice =
      this.nbNodes * this.flavor.hourlyPrice.priceInUcents +
      this.flavor.hourlyPricePerGB.priceInUcents *
        this.additionalDiskSize *
        this.storageNodeFactor;
    return newPrice - this.initialPrice;
  }

  get taxDelta() {
    const newTax =
      this.nbNodes * this.flavor.hourlyPrice.tax +
      this.flavor.hourlyPricePerGB.tax *
        this.additionalDiskSize *
        this.storageNodeFactor;
    return newTax - this.initialTax;
  }

  upgradeStorage() {
    this.trackDashboard('general_information::popin_upgrade_storage_validate');
    this.upgradingStorage = true;
    return this.DatabaseService.updateDatabaseEngineProperties(
      this.projectId,
      this.database.engine,
      this.database.id,
      {
        disk: {
          size: this.flavor.minDiskSize + this.additionalDiskSize,
        },
      },
    )
      .then((databaseInfo) => {
        this.database.updateData(databaseInfo);
        return this.onStorageUpgrade(
          this.$translate.instant(
            'pci_databases_general_information_upgrade_storage_success',
          ),
          'info',
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_upgrade_storage_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDashboard('general_information::popin_upgrade_storage_cancel');
    this.goBack();
  }
}
