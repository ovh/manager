export default class TelecomPackMigrationBuildingsCtrl {
  /* @ngInject */
  constructor($translate, TucPackMigrationProcess) {
    this.$translate = $translate;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
  }

  $onInit() {
    this.process = this.TucPackMigrationProcess.getMigrationProcess();
    this.buildingsList = this.process.buildings;
  }

  selectBuilding(building) {
    // initialize selected building
    this.TucPackMigrationProcess.setSelectedBuilding(building);

    // check if the building name is empty to set a name to display in the select component
    this.process.selectedBuilding.name =
      building.name === ''
        ? this.$translate.instant(
            'telecom_pack_migration_building_details_unknown',
          )
        : building.name;

    // Display offers
    this.process.currentStep = 'offers';
  }
}
