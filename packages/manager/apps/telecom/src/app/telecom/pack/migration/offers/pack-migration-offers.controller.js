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

    angular.forEach(offer.options, (option) => {
      if (option.name === 'gtr_ovh' && option.selected) {
        totalOfferPrice += option.optionalPrice.value;
      } else if (option.name === optionName) {
        totalOfferPrice += value * option.optionalPrice.value;
      } else if (
        option.name !== 'gtr_ovh' &&
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

  selectOffer(offer) {
    const selectedOffer = offer;
    const params = {
      offerName: selectedOffer.offerName,
    };

    // Retrieve option values (included and added)
    const options = [];

    Object.entries(selectedOffer.options).map(([key, option]) => {
      if (option.included > 0 || option.choosedValue > 0) {
        options.push({
          quantity:
            option.included +
            (option.choosedValue > 0 ? option.choosedValue : 0),
          name: option.name,
        });
      }
      return key;
    });

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
