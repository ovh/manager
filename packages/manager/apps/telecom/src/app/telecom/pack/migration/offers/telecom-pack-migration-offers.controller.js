import find from 'lodash/find';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

angular.module('managerApp').controller('TelecomPackMigrationOffersCtrl', function TelecomPackMigrationOffersCtrl($q, $translate, TucPackMigrationProcess, TucToast) {
  const self = this;

  self.process = null;
  self.loading = {
    init: false,
  };

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  self.updateOfferDisplayedPrice = function updateOfferDisplayedPrice(value, offer) {
    let totalOfferPrice = offer.price.value;

    angular.forEach(offer.options, (option) => {
      if (option.name === 'gtr_ovh' && option.selected) {
        totalOfferPrice += option.optionalPrice.value;
      } else if (option.name !== 'gtr_ovh' && !isUndefined(option.choosedValue)) {
        totalOfferPrice += value * option.optionalPrice.value;
      }
    });

    set(offer, 'displayedPrice', TucPackMigrationProcess.getPriceStruct(totalOfferPrice));
  };

  self.selectOffer = function selectOffer(offer) {
    TucPackMigrationProcess.selectOffer(offer);
  };

  /* -----  End of ACTIONS  ------*/

  /*= ==============================
  =            HELPERS            =
  =============================== */

  self.hasOfferWithSubServicesToDelete = function hasOfferWithSubServicesToDelete() {
    return !!find(
      self.process.migrationOffers.result.offers,
      offer => offer.totalSubServiceToDelete > 0,
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.loading.init = true;

    return TucPackMigrationProcess.initOffersView().then((migrationProcess) => {
      self.process = migrationProcess;
    }, (error) => {
      TucToast.error([$translate.instant('telecom_pack_migration_offer_choice_error_loading'), get(error, 'data.message', '')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
