angular.module('managerApp').controller('TelecomPackMigrationConfirmCtrl', function ($q, $translate, TucPackMigrationProcess, TucToast) {
  const self = this;

  self.process = null;
  self.loading = {
    migrate: false,
  };
  self.choosedAdditionalOptions = null;
  self.model = {
    acceptContracts: false,
  };
  self.modemTransportPrice = 9.99;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  self.getOptionPrice = function (option) {
    return TucPackMigrationProcess.getPriceStruct(option.optionalPrice.value * option.choosedValue);
  };

  self.getFirstMensuality = function () {
    return TucPackMigrationProcess
      .getPriceStruct(self.process.selectedOffer.displayedPrice.value + 9.99);
  };

  self.getServiceToDeleteList = function (subService) {
    return _.pluck(_.filter(subService.services, {
      selected: true,
    }), 'name').join(', ');
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  self.startMigration = function () {
    self.loading.migrate = true;
    return TucPackMigrationProcess.startMigration().then((migrationTask) => {
      self.process.migrationTaskId = migrationTask.id;
      self.process.currentStep = 'migration';
    }, (error) => {
      TucToast.error([$translate.instant('telecom_pack_migration_error'), _.get(error, 'data.message', '')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.migrate = false;
    });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.process = TucPackMigrationProcess.getMigrationProcess();
    self.choosedAdditionalOptions = TucPackMigrationProcess.getOptionsSelected();
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
