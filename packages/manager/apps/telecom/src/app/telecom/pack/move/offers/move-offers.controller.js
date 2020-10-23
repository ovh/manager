import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

export default class PackMoveOffersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    OvhApiPackXdsl,
    OvhApiPackXdslMove,
    TucToast,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiPackXdslMove = OvhApiPackXdslMove;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.loading = {
      init: true,
    };

    this.$q
      .all([this.getOptions(), this.getCopperOffers()])
      .then(() => {
        return this.getFiberOffers();
      })
      .then(() => {
        if (this.eligibilityReferenceFiber) {
          this.offers = [...this.listOffers, ...this.listOffersFiber];
        } else {
          this.offers = [...this.listOffers];
        }
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Get available options
   */
  getOptions() {
    return this.OvhApiPackXdsl.v6()
      .getServices({
        packId: this.packName,
      })
      .$promise.then((options) => {
        this.currentOffer.options = options;
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('pack_move_choose_offer_error', {
            error,
          }),
        );
      });
  }

  getCopperOffers() {
    return this.OvhApiPackXdslMove.v6()
      .pollOffers(this.$scope, {
        packName: this.packName,
        eligibilityReference: this.eligibilityReference,
      })
      .then((offers) => {
        if (offers.status === 'error') {
          this.TucToast.error(
            this.$translate.instant('pack_move_choose_offer_error', {
              error: offers.error,
            }),
          );
        } else {
          this.listOffers = offers.result.offers;
          this.listOffers = this.listOffers.map((offer) => ({
            ...offer,
            displayedPrice: offer.prices.price.price,
            eligibilityReference: this.eligibilityReference,
          }));
        }
        return this.listOffers;
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('pack_move_choose_offer_error', {
            error,
          }),
        );
      });
  }

  getFiberOffers() {
    if (!this.eligibilityReferenceFiber) {
      return null;
    }

    return this.OvhApiPackXdslMove.v6()
      .pollOffers(this.$scope, {
        packName: this.packName,
        eligibilityReference: this.eligibilityReferenceFiber,
      })
      .then((fiberOffers) => {
        if (fiberOffers === 'error') {
          this.TucToast.error(
            this.$translate.instant('pack_move_choose_offer_error', {
              error: fiberOffers.error,
            }),
          );
        } else {
          this.listOffersFiber = fiberOffers.result.offers;
          this.listOffersFiber = this.listOffersFiber.map((offer) => ({
            ...offer,
            displayedPrice: offer.prices.price.price,
            eligibilityReference: this.eligibilityReferenceFiber,
          }));
        }
        return this.listOffersFiber;
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('pack_move_choose_offer_error', {
            error,
          }),
        );
      });
  }

  /**
   * Check if option to display is available
   * @param {*} offer offer to check
   * @param {*} optionName option to display
   */
  static isOptionAvailable(offer, optionName) {
    return !!find(offer.options, (option) => option.name === optionName);
  }

  /**
   * Check if there are subservices to delete
   */
  hasOfferWithSubServicesToDelete() {
    this.offers.forEach((offer) => {
      let total = 0;
      const udpateOffer = offer;
      offer.subServicesToDelete.forEach((service) => {
        total += service.numberToDelete;
        return total;
      });
      udpateOffer.totalSubServiceToDelete = total;
      return udpateOffer;
    });
    return !!find(this.offers, (offer) => offer.totalSubServiceToDelete > 0);
  }

  static updateOfferDisplayedPrice(value, offer, optionName) {
    let totalOfferPrice = offer.prices.price.price
      ? offer.prices.price.price.value
      : 0;

    offer.options.forEach((option) => {
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

    const displayedPrice = {
      currencyCode: offer.prices.price.price
        ? offer.prices.price.price.currencyCode
        : 'EUR',
      text: offer.prices.price.price
        ? offer.prices.price.price.text.replace(
            /\d+(?:[.,]\d+)?/,
            totalOfferPrice.toFixed(2),
          )
        : totalOfferPrice.toFixed(2),
      value: totalOfferPrice,
    };
    set(offer, 'displayedPrice', displayedPrice);
  }

  static isChosen(option) {
    return option.choosedValue > 0;
  }

  selectOffer(offer) {
    const selectedOffer = offer;

    const params = {
      eligibilityReference: selectedOffer.eligibilityReference,
      offerName: selectedOffer.offerName,
    };

    // Retrieve option values (included and added)
    const options = selectedOffer.options
      .filter(
        (option) => option.included > 0 || this.constructor.isChosen(option),
      )
      .map((option) => ({
        quantity:
          option.included +
          (this.constructor.isChosen(option) ? option.choosedValue : 0),
        name: option.name,
      }));

    if (options.length > 0) {
      params.options = options;
    }

    return this.OvhApiPackXdslMove.v6()
      .servicesToDelete({ packName: this.packName }, params)
      .$promise.then((result) => {
        selectedOffer.subServicesToDelete = result;
        this.$scope.$emit('offerSelected', selectedOffer);

        return result;
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('pack_move_choose_offer_error', {
            error,
          }),
        );
      });
  }
}
