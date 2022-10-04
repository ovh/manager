import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';

import { PROMO_DISPLAY, QUANTITY } from '../pack-migration.constant';

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

    this.PROMO_DISPLAY = PROMO_DISPLAY;
    this.QUANTITY = QUANTITY;

    this.modemTransportPrice = 9.99;

    this.process = this.TucPackMigrationProcess.getMigrationProcess();
    this.choosedAdditionalOptions = this.TucPackMigrationProcess.getOptionsSelected();

    const gtrComfortSelected = this.choosedAdditionalOptions.some((option) =>
      option.name.match(/^gtr_\d{1,2}m_/),
    )
      ? 1
      : 0;

    const modemRental = this.process.selectedOffer.modemRental?.value || 0;
    const firstYearPromo = this.process.selectedOffer.firstYearPromo
      ? this.process.selectedOffer.price.value -
        this.process.selectedOffer.firstYearPromo.value
      : 0;
    const providerOrange =
      this.process.selectedOffer.providerOrange?.value || 0;
    const providerAI = this.process.selectedOffer.providerAI?.value || 0;
    const gtrComfortFees = this.process.selectedOffer.gtrComfortFees
      ? gtrComfortSelected * this.process.selectedOffer.gtrComfortFees.value
      : 0;

    let totalOfferPrice = 0;
    if (this.choosedAdditionalOptions.length === 0) {
      totalOfferPrice =
        this.process.selectedOffer.price.value -
        firstYearPromo +
        modemRental +
        providerOrange +
        providerAI;
    } else {
      totalOfferPrice =
        this.process.selectedOffer.displayedPrice.value -
        firstYearPromo +
        modemRental +
        providerOrange +
        providerAI +
        gtrComfortFees;
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

  static checkContactPhone(value) {
    if (value) {
      return !!(
        value.match(/^\+?(\d|\.| |#|-)+$/) &&
        value.length < 26 &&
        value.length > 2
      );
    }
    return true;
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

  static isGtrOption(optionName) {
    return optionName.startsWith('gtr_') ? 1 : 0;
  }

  static isOneOptionSelected(selectedOffer) {
    return Object.entries(selectedOffer.options).some(
      ([optionName, option]) => {
        return optionName.startsWith('gtr_') && option.selected === true;
      },
    );
  }

  /* -----  End of ACTIONS  ------*/
}
