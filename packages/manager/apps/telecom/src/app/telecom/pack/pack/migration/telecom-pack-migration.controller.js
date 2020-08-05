import get from 'lodash/get';
import head from 'lodash/head';

angular
  .module('managerApp')
  .controller('TelecomPackMigrationCtrl', function TelecomPackMigrationCtrl(
    $q,
    $stateParams,
    $translate,
    TucPackMigrationProcess,
    TucToast,
  ) {
    const self = this;

    self.process = null;

    self.loading = {
      init: false,
    };

    /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

    function init() {
      self.loading.init = true;
      self.process = TucPackMigrationProcess.init($stateParams.packName);

      return TucPackMigrationProcess.checkForPendingMigration()
        .then(
          (pendingTasks) => {
            if (pendingTasks && pendingTasks.length === 1) {
              self.process.currentStep = 'migration';
              self.process.migrationTaskId = head(pendingTasks);
              self.process.migrationDoing = true;
            } else {
              self.process.currentStep = 'offers';
            }
          },
          (error) => {
            TucToast.error(
              [
                $translate.instant(
                  'telecom_pack_migration_offer_choice_error_loading',
                ),
                get(error, 'data.message', ''),
              ].join(' '),
            );
            return $q.reject(error);
          },
        )
        .finally(() => {
          self.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------*/

    init();
  });
