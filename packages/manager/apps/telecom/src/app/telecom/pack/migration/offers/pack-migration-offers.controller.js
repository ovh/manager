import find from 'lodash/find';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

import { PROMO_DISPLAY } from '../pack-migration.constant';

export default class TelecomPackMigrationOffersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiPackXdsl,
    TucPackMigrationProcess,
    TucToast,
  ) {
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

    return this.OvhApiPackXdsl.v6()
      .servicesToDelete({ packName: this.process.pack.packName }, params)
      .$promise.then((result) => {
        selectedOffer.subServicesToDelete = result;
        this.TucPackMigrationProcess.selectOffer(selectedOffer);
        return result;
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('telecom_pack_migration_choose_offer_error', {
            error,
          }),
        );
      });
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
