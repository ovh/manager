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

    this.showMonthlyPrices = false;

    this.originallyAddedDiskSize =
      this.database.storage.size.value - this.flavor.minDiskSize;
    this.additionalDiskSize = this.originallyAddedDiskSize;

    const engine = this.engines.find(
      (engineObject) => engineObject.name === this.database.engine,
    );
    this.nbNodes = this.database.nodes.length;
    this.storageNodeFactor = engine.isDistributedStorage ? 1 : this.nbNodes;
  }

  get flavorPrice() {
    return this.showMonthlyPrices
      ? this.flavor.monthlyPrice
      : this.flavor.hourlyPrice;
  }

  get additionalDiskPrice() {
    return this.showMonthlyPrices
      ? this.flavor.monthlyPricePerGB
      : this.flavor.hourlyPricePerGB;
  }

  computeStoragePrice(flavorPrice, additionalDiskPrice, storage) {
    return (
      this.nbNodes * flavorPrice +
      additionalDiskPrice * storage * this.storageNodeFactor
    );
  }

  get initialPrice() {
    return this.computeStoragePrice(
      this.flavorPrice.priceInUcents,
      this.additionalDiskPrice.priceInUcents,
      this.originallyAddedDiskSize,
    );
  }

  get initialTax() {
    return this.computeStoragePrice(
      this.flavorPrice.tax,
      this.additionalDiskPrice.tax,
      this.originallyAddedDiskSize,
    );
  }

  get priceDelta() {
    const newPrice = this.computeStoragePrice(
      this.flavorPrice.priceInUcents,
      this.additionalDiskPrice.priceInUcents,
      this.additionalDiskSize,
    );
    return newPrice - this.initialPrice;
  }

  get taxDelta() {
    const newTax = this.computeStoragePrice(
      this.flavorPrice.tax,
      this.additionalDiskPrice.tax,
      this.additionalDiskSize,
    );
    return newTax - this.initialTax;
  }

  get priceUnitTranslation() {
    const unitKey = this.showMonthlyPrices
      ? 'pci_databases_general_information_upgrade_storage_summary_price_monthly_unit'
      : 'pci_databases_general_information_upgrade_storage_summary_price_hourly_unit';
    return this.$translate.instant(unitKey);
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
