import chunk from 'lodash/chunk';
import every from 'lodash/every';
import filter from 'lodash/filter';

angular.module('managerApp').controller('TelecomPackMigrationServiceDeleteCtrl', function (TucPackMigrationProcess) {
  const self = this;

  self.process = null;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  self.selectedSubServiceToDeleteReached = function (subService) {
    const count = filter(subService.services, {
      selected: true,
    }).length;

    return count === subService.numberToDelete;
  };

  self.isValidSelection = function () {
    return every(
      self.process.selectedOffer.subServicesToDelete,
      subService => self.selectedSubServiceToDeleteReached(subService),
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
