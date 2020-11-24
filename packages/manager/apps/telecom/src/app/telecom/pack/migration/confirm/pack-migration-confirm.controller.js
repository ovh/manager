import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';

export default class TelecomPackMigrationConfirmCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    TucPackMigrationProcess,
    TucToast,
    PROMO_DISPLAY,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.TucToast = TucToast;
    this.PROMO_DISPLAY = PROMO_DISPLAY;
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

    const modemRental = this.process.selectedOffer.modemRental
      ? this.process.selectedOffer.modemRental.value
      : 0;
    const firstYearPromo = this.process.selectedOffer.firstYearPromo
      ? this.process.selectedOffer.price.value -
        this.process.selectedOffer.firstYearPromo.value
      : 0;

    let totalOfferPrice = 0;
    if (this.choosedAdditionalOptions.length === 0) {
      totalOfferPrice =
        this.process.selectedOffer.price.value - firstYearPromo + modemRental;
    } else {
      totalOfferPrice =
        this.process.selectedOffer.displayedPrice.value -
        firstYearPromo +
        modemRental;
    }
    this.process.selectedOffer.displayedPrice = this.TucPackMigrationProcess.getPriceStruct(
      totalOfferPrice,
    );
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

  static getServiceToDeleteList(subService) {
    return map(
      filter(subService.services, {
        selected: true,
      }),
      'name',
    ).join(', ');
  }

  getReductionPriceFirstYear() {
    const value =
      this.process.selectedOffer.price.value -
      this.process.selectedOffer.firstYearPromo.value;
    const priceText = this.process.selectedOffer.price.text.replace(
      /\d+(?:[.,]\d+)?/,
      value.toFixed(2),
    );
    return {
      currencyCode: this.process.selectedOffer.price.currencyCode,
      text: `- ${priceText}`,
      value,
    };
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
