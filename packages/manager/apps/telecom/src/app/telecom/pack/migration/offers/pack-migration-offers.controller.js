import find from 'lodash/find';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

export default class TelecomPackMigrationOffersCtrl {
  /* @ngInject */
  constructor($q, $translate, TucPackMigrationProcess, TucToast) {
    this.$q = $q;
    this.$translate = $translate;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.TucToast = TucToast;
  }

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
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
    this.TucPackMigrationProcess.selectOffer(offer);
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
