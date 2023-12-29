import get from 'lodash/get';
import Flavor from '../../../../../../../components/project/storages/databases/flavor.class';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.showMonthlyPrices = false;
    this.selectedPlan = null;
    this.selectedFlavor = { name: this.database.flavor };
    this.showFlavors = false;
    this.upgradingPlan = false;
    this.trackDatabases('config_upgrade_plan', 'page');
  }

  onPlanSelect(selectedPlan) {
    this.trackDatabases(`config_upgrade_plan::select_${selectedPlan.name}`);
    this.trackDatabases(
      `PublicCloud::databases_upgrade_plan_selection::${this.currentPlan.name}::${selectedPlan.name}`,
      'action',
      false,
    );
    // Check if flavor matches. If not, we show possible flavors
    const possibleFlavors = selectedPlan.availabilities
      .filter(
        (availability) =>
          availability.region === this.database.region &&
          availability.specifications.network === this.database.networkType,
      )
      .map(
        (planAvailability) =>
          new Flavor(planAvailability.flavor, [planAvailability]),
      )
      .sort((a, b) => b.compare(a));
    if (
      !possibleFlavors.find((flavor) => flavor.name === this.database.flavor)
    ) {
      this.showFlavors = true;
      [this.selectedFlavor] = possibleFlavors;
      this.possibleFlavors = possibleFlavors;
    } else {
      this.showFlavors = false;
      this.selectedFlavor = { name: this.database.flavor };
    }
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
      this.selectedFlavor.name,
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
