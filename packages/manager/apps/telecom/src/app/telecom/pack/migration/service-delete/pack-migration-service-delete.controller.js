import chunk from 'lodash/chunk';
import every from 'lodash/every';
import filter from 'lodash/filter';
import map from 'lodash/map';
import set from 'lodash/set';

export default class TelecomPackMigrationServiceDeleteCtrl {
  /* @ngInject */
  constructor(TucPackMigrationProcess) {
    this.TucPackMigrationProcess = TucPackMigrationProcess;
  }

  $onInit() {
    this.process = null;
    this.process = this.TucPackMigrationProcess.getMigrationProcess();
    this.process.selectedOffer.subServicesToDelete.forEach((subService) => {
      set(
        subService,
        'services',
        map(subService.services, (service, index, originalArray) => ({
          name: service,
          selected: originalArray.length === subService.numberToDelete,
        })),
      );
    });

    this.chunkedSubServices = chunk(
      this.process.selectedOffer.subServicesToDelete,
      2,
    );
  }

  /*= ==============================
  =            HELPERS            =
  =============================== */
  static selectedSubServiceToDeleteReached(subService) {
    const count = filter(subService.services, {
      selected: true,
    }).length;

    return count === subService.numberToDelete;
  }

  isValidSelection() {
    return every(this.process.selectedOffer.subServicesToDelete, (subService) =>
      this.constructor.selectedSubServiceToDeleteReached(subService),
    );
  }

  /* -----  End of HELPERS  ------*/
}
