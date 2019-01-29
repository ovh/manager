angular.module('managerApp').controller('TelecomPackMigrationMigrationCtrl', function ($scope, TucPackMigrationProcess) {
  const self = this;

  self.loading = {
    migrate: false,
  };
  self.process = null;
  self.migrationStatus = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.migrate = true;
    self.process = TucPackMigrationProcess.getMigrationProcess();

    return TucPackMigrationProcess.startTaskPolling().then(() => {
      self.migrationStatus = 'success';
      self.loading.migrate = false;
    }, () => {
      self.migrationStatus = 'error';
      self.loading.migrate = false;
    });
  }

  $scope.$on('$destroy', () => {
    TucPackMigrationProcess.stopTaskPolling();
  });

  /* -----  End of INITIALIZATION  ------*/

  init();
});
