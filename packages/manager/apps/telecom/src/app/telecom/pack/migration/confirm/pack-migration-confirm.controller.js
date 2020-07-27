import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';

export default class TelecomPackMigrationConfirmCtrl {
  /* @ngInject */
  constructor($q, $translate, TucPackMigrationProcess, TucToast) {
    this.$q = $q;
    this.$translate = $translate;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.process = null;
    this.loading = {
      migrate: false,
    };
    this.choosedAdditionalOptions = null;
    this.model = {
      acceptContracts: false,
    };
    this.modemTransportPrice = 9.99;

    this.process = this.TucPackMigrationProcess.getMigrationProcess();
    this.choosedAdditionalOptions = this.TucPackMigrationProcess.getOptionsSelected();
  }

  /*= ==============================
  =            HELPERS            =
  =============================== */

  getOptionPrice(option) {
    return this.TucPackMigrationProcess.getPriceStruct(
      option.optionalPrice.value * option.choosedValue,
    );
  }

  getFirstMensuality() {
    return this.TucPackMigrationProcess.getPriceStruct(
      this.process.selectedOffer.displayedPrice.value + 9.99,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  getServiceToDeleteList(subService) {
    return map(
      filter(subService.services, {
        selected: true,
      }),
      'name',
    ).join(', ');
  }

  /* -----  End of HELPERS  ------*/

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  startMigration() {
    this.loading.migrate = true;
    return this.TucPackMigrationProcess.startMigration()
      .then((migrationTask) => {
        this.process.migrationTaskId = migrationTask.id;
        this.process.currentStep = 'migration';
      })
      .catch((error) => {
        this.TucToast.error(
          [
            this.$translate.instant('telecom_pack_migration_error'),
            get(error, 'data.message', ''),
          ].join(' '),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loading.migrate = false;
      });
  }

  /* -----  End of ACTIONS  ------*/
}
