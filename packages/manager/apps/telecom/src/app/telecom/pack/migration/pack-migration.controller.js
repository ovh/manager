import get from 'lodash/get';
import head from 'lodash/head';

import { PROCESS_STEP } from './pack-migration.constant';

export default class TelecomPackMigrationCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiConnectivityEligibilitySearch,
    OvhApiXdsl,
    OvhApiPackXdslAccess,
    TucPackMigrationProcess,
    TucToast,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiConnectivityEligibilitySearch = OvhApiConnectivityEligibilitySearch;
    this.OvhApiXdsl = OvhApiXdsl;
    this.OvhApiPackXdslAccess = OvhApiPackXdslAccess;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.TucToast = TucToast;
  }

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading = {
      init: false,
    };
    this.process = null;

    this.loading.init = true;
    this.process = this.TucPackMigrationProcess.init(this.packName);

    return this.TucPackMigrationProcess.checkForPendingMigration()
      .then((pendingTasks) => {
        if (pendingTasks && pendingTasks.length === 1) {
          this.process.currentStep = PROCESS_STEP.migration;
          this.process.migrationTaskId = head(pendingTasks);
          this.process.migrationDoing = true;
        } else {
          this.getPackAccess();
        }
        return this.process;
      })
      .catch((error) => {
        const msgErr = `${this.$translate.instant(
          'telecom_pack_migration_offer_choice_error_loading',
        )} ${get(error, 'data.message', '')}`;
        this.TucToast.error(msgErr);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  // Retrieve services from pack
  getPackAccess() {
    this.loading.init = true;
    return this.OvhApiPackXdslAccess.v6()
      .getServices({
        packId: this.process.pack.packName,
      })
      .$promise.then((packServices) => {
        const [service] = packServices;
        if (service.includes('xdsl')) {
          // Retrieve line associated to the service
          return this.getLine(service);
        }
        // Display offers
        this.process.currentStep = PROCESS_STEP.offers;
        return packServices;
      })
      .catch((error) => {
        const msgErr = `${this.$translate.instant(
          'telecom_pack_migration_pack_access_error',
        )} ${get(error, 'data.message', '')}`;
        this.TucToast.error(msgErr);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  // Retrieve line from service
  getLine(xdslId) {
    return this.OvhApiXdsl.v6()
      .lines({ xdslId })
      .$promise.then((lines) => {
        const [line] = lines;
        // Search building by line to retrieve buildings elements
        return this.searchBuildingByLine(line);
      })
      .catch((error) => {
        const msgErr = `${this.$translate.instant(
          'telecom_pack_migration_pack_access_error',
        )} ${get(error, 'data.message', '')}`;
        this.TucToast.error(msgErr);
      });
  }

  searchBuildingByLine(lineNumber) {
    return this.OvhApiConnectivityEligibilitySearch.v6()
      .searchBuildingByLines(this.$scope, { lineNumber, status: 'active' })
      .then((data) => {
        if (data.result.length > 0) {
          const buildings = data.result;
          if (buildings && buildings.length > 1) {
            this.TucPackMigrationProcess.setBuildings(buildings);

            // Display buildings to select one
            this.process.currentStep = PROCESS_STEP.buildings;
          } else if (buildings && buildings.length === 1) {
            const [building] = buildings;

            // check if the building name is empty to set a name or the building reference to display in the select component
            building.name = building.name || building.reference;

            this.TucPackMigrationProcess.setSelectedBuilding(building);

            // Display offers
            this.process.currentStep = PROCESS_STEP.offers;
          }
          return data;
        }
        // Display offers
        this.process.currentStep = PROCESS_STEP.offers;

        return null;
      })
      .catch((error) => {
        const msgErr = `${this.$translate.instant(
          'telecom_pack_migration_pack_access_error',
        )} ${get(error, 'data.message', '')}`;
        this.TucToast.error(msgErr);
      });
  }
}
