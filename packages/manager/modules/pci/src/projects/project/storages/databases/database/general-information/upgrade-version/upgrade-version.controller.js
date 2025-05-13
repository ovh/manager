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
    this.upgradingVersion = false;
    this.selectedVersion = null;
    this.trackDashboard('general_information::upgrade_version', 'page');
  }

  upgradeVersion() {
    this.trackDashboard('general_information::popin_upgrade_version_validate');
    this.upgradingVersion = true;
    return this.DatabaseService.editDatabase(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.database.description,
      this.database.plan,
      this.selectedVersion.version,
      this.database.flavor.name,
    )
      .then((databaseInfo) => {
        this.database.updateData(databaseInfo);
        return this.onVersionUpgrade(
          this.$translate.instant(
            'pci_databases_general_information_upgrade_version_success',
          ),
          'info',
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_upgrade_version_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDashboard('general_information::popin_upgrade_version_cancel');
    this.goBack();
  }
}
