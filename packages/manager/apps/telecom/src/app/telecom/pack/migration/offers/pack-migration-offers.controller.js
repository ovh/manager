import find from 'lodash/find';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

import {
  PROMO_DISPLAY,
  MODEM_LIST,
  MODEM_OPTION_NAME,
} from '../pack-migration.constant';

export default class TelecomPackMigrationOffersCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    OvhApiPackXdsl,
    TucPackMigrationProcess,
    TucToast,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.TucToast = TucToast;
  }

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.PROMO_DISPLAY = PROMO_DISPLAY;
    this.MODEM_LIST = MODEM_LIST;
    this.MODEM_OPTION_NAME = MODEM_OPTION_NAME;
    this.process = null;
    this.loading = {
      init: true,
    };

    return this.TucPackMigrationProcess.initOffersView()
      .then((migrationProcess) => {
        this.process = migrationProcess;
      })
      .catch((error) => {
        const msgErr = `${this.$translate.instant(
          'telecom_pack_migration_offer_choice_error_loading',
        )} ${get(error, 'data.message', '')}`;
        this.TucToast.error(msgErr);
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  updateOfferDisplayedPrice(value, offer, optionName) {
    let totalOfferPrice = offer.price.value;

    Object.values(offer.options).forEach((option) => {
      if (option.name.startsWith('gtr_') && option.selected !== null) {
        const val = option.selected === true ? 1 : 0;
        totalOfferPrice += val * option.optionalPrice.value;
      } else if (
        option.name === optionName ||
        `${option.name}_${option.optional}` === optionName
      ) {
        totalOfferPrice += value * option.optionalPrice.value;
      } else if (
        !option.name.startsWith('gtr_') &&
        !isUndefined(option.choosedValue)
      ) {
        totalOfferPrice += option.choosedValue * option.optionalPrice.value;
      }
    });

    if (optionName === this.MODEM_OPTION_NAME) {
      offer.modemOptions.forEach((modem) => {
        if (modem.name === offer.modem && modem.price) {
          totalOfferPrice += modem.price.value;
        }
      });
    }

    set(
      offer,
      'displayedPrice',
      this.TucPackMigrationProcess.getPriceStruct(totalOfferPrice),
    );
  }

  static updateSelectedGtrOption(offer, optionName) {
    let optionComfort = false;
    Object.values(offer.options).forEach((option) => {
      if (
        option.name.startsWith('gtr_') &&
        option.selected !== null &&
        optionName.startsWith('gtr_')
      ) {
        if (option.name !== optionName) {
          set(option, 'selected', false);
        }
        if (optionName.match(/^gtr_\d{1,2}m_/) && option.selected === true) {
          optionComfort = true;
        }
        set(offer, 'gtrComfortActivated', optionComfort);
      }
    });
  }

  updateOfferPriceAndGtr(value, offer, optionName) {
    this.constructor.updateSelectedGtrOption(offer, optionName);
    this.updateOfferDisplayedPrice(value, offer, optionName);
  }

  selectOffer(offer) {
    if (!offer.modem) {
      set(offer, 'modemRequired', true);
      return;
    }
    const selectedOffer = offer;
    const params = {
      offerName: selectedOffer.offerName,
    };

    // Retrieve option values (included and added)
    const options = Object.values(selectedOffer.options)
      .filter((option) => option.included > 0 || option.choosedValue > 0)
      .map((option) => ({
        quantity:
          option.included + (option.choosedValue > 0 ? option.choosedValue : 0),
        name: option.name,
      }));

    if (options.length > 0) {
      params.options = options;
    }

    // Update modem rental from selected modem detail
    selectedOffer.modemOptions.forEach((modem) => {
      if (modem.name === selectedOffer.modem) {
        selectedOffer.modemRental = modem.price;
      }
      if (this.MODEM_LIST.includes(selectedOffer.modem)) {
        selectedOffer.needNewModem = true;
      }
    });

    this.loading.init = true;

    this.$http
      .post(
        `/pack/xdsl/${this.process.pack.packName}/migration/servicesToDeleteUnpackTerms`,
        params,
      )
      .then((result) => {
        selectedOffer.subServicesToDelete = result.data;
        this.TucPackMigrationProcess.selectOffer(selectedOffer);
        return result.data;
      })
      .catch((error) => {
        // Display error message
        this.TucToast.error(
          this.$translate.instant('telecom_pack_migration_choose_offer_error', {
            error,
          }),
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  getModemOptionLabel(modemOption) {
    return this.$translate.instant(
      `telecom_pack_migration_modem_${modemOption.name}`,
      {
        price: modemOption.price ? modemOption.price.text : '',
      },
    );
  }

  onChangeSelectModem(offer) {
    if (offer.modemRequired && offer.modem) {
      set(offer, 'modemRequired', false);
    }
    if (offer.modem) {
      this.updateOfferDisplayedPrice(1, offer, this.MODEM_OPTION_NAME);
    }
  }

  /* -----  End of ACTIONS  ------*/

  /*= ==============================
  =            HELPERS            =
  =============================== */

  hasOfferWithSubServicesToDelete() {
    return !!find(
      this.process.migrationOffers.result.offers,
      (offer) => offer.totalSubServiceToDelete > 0,
    );
  }

  /* -----  End of HELPERS  ------*/
}
