angular.module('managerApp').controller('TelecomPackMigrationServiceDeleteCtrl', function (TucPackMigrationProcess) {
  const self = this;

  self.process = null;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  self.selectedSubServiceToDeleteReached = function (subService) {
    const count = _.filter(subService.services, {
      selected: true,
    }).length;

    return count === subService.numberToDelete;
  };

  self.isValidSelection = function () {
    return _.every(
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

    self.chunkedSubServices = _.chunk(self.process.selectedOffer.subServicesToDelete, 2);
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
