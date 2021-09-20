import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.selectedPlan = null;
    this.upgradingPlan = false;
  }

  onPlanSelect(selectedPlan) {
    this.trackDatabases(`config_upgrade_plan::select_${selectedPlan.name}`);
    this.trackDatabases(
      `PublicCloud::databases_upgrade_plan_selection::${this.currentPlan.name}::${selectedPlan.name}`,
      'action',
      false,
    );
  }

  upgradePlan() {
    this.trackDatabases('config_upgrade_plan_validate');
    this.trackDatabases(
      `PublicCloud::databases_upgrade_plan_validated::${this.currentPlan.name}::${this.selectedPlan.name}`,
      'action',
      false,
    );
    this.upgradingPlan = true;
    return this.DatabaseService.editDatabase(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.database.description,
      this.selectedPlan.name,
      this.database.version,
      this.database.flavor.name,
    )
      .then((databaseInfo) => {
        this.database.updateData(databaseInfo);
        return this.onPlanUpgrade(
          this.$translate.instant(
            'pci_databases_general_information_upgrade_plan_success',
          ),
          'info',
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_upgrade_plan_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDatabases('config_upgrade_plan_cancel');
    this.goBack();
  }
}
