import chunk from 'lodash/chunk';
import every from 'lodash/every';
import filter from 'lodash/filter';

angular.module('managerApp').controller('TelecomPackMigrationServiceDeleteCtrl', function TelecomPackMigrationServiceDeleteCtrl(TucPackMigrationProcess) {
  const self = this;

  self.process = null;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  self.selectedSubServiceToDeleteReached = function selectedSubServiceToDeleteReached(subService) {
    const count = filter(subService.services, {
      selected: true,
    }).length;

    return count === subService.numberToDelete;
  };

  self.isValidSelection = function isValidSelection() {
    return every(
      self.process.selectedOffer.subServicesToDelete,
      (subService) => self.selectedSubServiceToDeleteReached(subService),
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.process = TucPackMigrationProcess.getMigrationProcess();

    self.chunkedSubServices = chunk(self.process.selectedOffer.subServicesToDelete, 2);
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
