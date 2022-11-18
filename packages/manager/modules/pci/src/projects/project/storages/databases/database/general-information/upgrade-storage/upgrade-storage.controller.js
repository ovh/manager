import get from 'lodash/get';

export default class UpgradeStorageCtrll {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDatabases('config_upgrade_storage', 'page');
    this.additionalDiskSize = this.database.disk.size - this.flavor.minDiskSize;
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
