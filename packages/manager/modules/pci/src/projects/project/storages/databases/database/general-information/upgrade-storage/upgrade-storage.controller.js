import get from 'lodash/get';

export default class UpgradeStorageCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDatabases('config_upgrade_storage', 'page');

    this.originallyAddedDiskSize =
      this.database.disk.size - this.flavor.minDiskSize;
    this.additionalDiskSize = this.originallyAddedDiskSize;

    // compute initial price and tax
    this.initialPrice =
      this.database.nodes.length *
      (this.flavor.hourlyPrice.priceInUcents +
        this.flavor.hourlyPricePerGB.priceInUcents *
          this.originallyAddedDiskSize);
    this.initialTax =
      this.database.nodes.length *
      (this.flavor.hourlyPrice.tax +
        this.flavor.hourlyPricePerGB.tax * this.originallyAddedDiskSize);
  }

  get priceDelta() {
    const newPrice =
      this.database.nodes.length *
      (this.flavor.hourlyPrice.priceInUcents +
        this.flavor.hourlyPricePerGB.priceInUcents * this.additionalDiskSize);
    return newPrice - this.initialPrice;
  }

  get taxDelta() {
    const newTax =
      this.database.nodes.length *
      (this.flavor.hourlyPrice.tax +
        this.flavor.hourlyPricePerGB.tax * this.additionalDiskSize);
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
