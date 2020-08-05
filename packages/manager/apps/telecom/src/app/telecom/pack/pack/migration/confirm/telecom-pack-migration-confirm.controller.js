import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';

angular
  .module('managerApp')
  .controller(
    'TelecomPackMigrationConfirmCtrl',
    function TelecomPackMigrationConfirmCtrl(
      $q,
      $translate,
      TucPackMigrationProcess,
      TucToast,
    ) {
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

      self.getOptionPrice = function getOptionPrice(option) {
        return TucPackMigrationProcess.getPriceStruct(
          option.optionalPrice.value * option.choosedValue,
        );
      };

      self.getFirstMensuality = function getFirstMensuality() {
        return TucPackMigrationProcess.getPriceStruct(
          self.process.selectedOffer.displayedPrice.value + 9.99,
        );
      };

      self.getServiceToDeleteList = function getServiceToDeleteList(
        subService,
      ) {
        return map(
          filter(subService.services, {
            selected: true,
          }),
          'name',
        ).join(', ');
      };

      /* -----  End of HELPERS  ------*/

      /*= ==============================
  =            ACTIONS            =
  =============================== */

      self.startMigration = function startMigration() {
        self.loading.migrate = true;
        return TucPackMigrationProcess.startMigration()
          .then(
            (migrationTask) => {
              self.process.migrationTaskId = migrationTask.id;
              self.process.currentStep = 'migration';
            },
            (error) => {
              TucToast.error(
                [
                  $translate.instant('telecom_pack_migration_error'),
                  get(error, 'data.message', ''),
                ].join(' '),
              );
              return $q.reject(error);
            },
          )
          .finally(() => {
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
    },
  );
