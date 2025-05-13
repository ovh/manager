import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

import {
  PROMO_DISPLAY,
  MODEM_OPTION_NAME,
  MODEM_LIST,
} from '../pack-move.constant';

export default class PackMoveOffersCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $scope,
    $translate,
    OvhApiPackXdsl,
    OvhApiPackXdslMove,
    TucToast,
  ) {
    this.$http = $http;
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

    this.PROMO_DISPLAY = PROMO_DISPLAY;
    this.MODEM_OPTION_NAME = MODEM_OPTION_NAME;
    this.MODEM_LIST = MODEM_LIST;

    this.getOptions()
      .then(() => {
        if (
          (!this.currentOffer.isFTTH || !this.eligibilityReferenceFiber) &&
          this.eligibilityReference
        ) {
          // Retrieve copper offers for xDSL customer or FTTH customer not eligible to fiber
          return this.getCopperOffers();
        }
        return null;
      })
      .then(() => {
        return this.getFiberOffers();
      })
      .then(() => {
        if (this.currentOffer.isFTTH && this.eligibilityReferenceFiber) {
          // For FTTH customer eligible to fiber, display fiber offers ONLY
          this.offers = this.listOffersFiber;
        } else if (
          this.eligibilityReferenceFiber &&
          !this.currentOffer.isFTTH
        ) {
          this.offers = this.listOffers
            ? [...this.listOffersFiber, ...this.listOffers]
            : [...this.listOffersFiber];
        } else {
          this.offers = this.listOffers;
        }
        this.initModemOptions();
        this.initGtrOptions();
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
            firstVoipLineFull: 0,
            lastVoipLineSelected: 0,
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
            firstVoipLineFull: 0,
            lastVoipLineSelected: 0,
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

  static updateOfferDisplayedPrice(value, offer, optionName, optional) {
    let totalOfferPrice = offer.prices.price.price
      ? offer.prices.price.price.value
      : 0;

    offer.options.forEach((option) => {
      if (option.name.startsWith('gtr_') && option.selected !== null) {
        const val = option.selected === true ? 1 : 0;
        totalOfferPrice += val * option.optionalPrice.value;
      } else if (
        option.name === optionName &&
        ((option.name === 'voip_line' && option.optional === optional) ||
          option.name !== 'voip_line')
      ) {
        totalOfferPrice += value * option.optionalPrice.value;
      } else if (
        !option.name.startsWith('gtr_') &&
        !isUndefined(option.choosedValue)
      ) {
        totalOfferPrice += option.choosedValue * option.optionalPrice.value;
      }
    });
    offer.modemOptions.forEach((modem) => {
      if (modem.name === offer.modem && modem.price) {
        totalOfferPrice += modem.price.value;
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

  static updateSelectedGtrOption(offer, optionName) {
    let optionComfort = false;
    offer.options.forEach((option) => {
      if (option.name.startsWith('gtr_') && option.selected !== null) {
        if (optionName && optionName.startsWith('gtr_')) {
          if (option.name !== optionName) {
            set(option, 'selected', false);
          } else {
            set(option, 'selected', true);
          }
          if (optionName.match(/^gtr_\d{1,2}m_/) && option.selected === true) {
            optionComfort = true;
          }
          set(offer, 'gtrComfortActivated', optionComfort);
        }
        if (!optionName) {
          set(option, 'selected', false);
        }
      }
    });
  }

  updateOfferPriceAndGtr(offer) {
    this.constructor.updateSelectedGtrOption(offer, offer.gtrSelected);
    this.constructor.updateOfferDisplayedPrice(1, offer, offer.gtrSelected);
  }

  static isChosen(option) {
    return option.choosedValue > 0;
  }

  static isGtrOptionExist(offer) {
    return offer.options.some((option) => option.name.startsWith('gtr_'));
  }

  initGtrOptions() {
    this.offers = this.offers.map((offer) => {
      const gtrOptions = Object.values(offer.options)
        .filter((el) => el.name.startsWith('gtr_'))
        .map((option) => ({
          ...option,
          label: this.$translate.instant(
            `telecom_pack_migration_${option.name}`,
            {
              price: option.optionalPrice.text,
            },
          ),
        }));

      if (gtrOptions.length > 0) {
        // Initialize GTR options with a none value
        gtrOptions.unshift({
          name: this.GTR_NONE,
          label: this.$translate.instant('pack_move_no_gtr'),
        });
      }

      set(offer, 'gtrOptions', gtrOptions);

      return offer;
    });
  }

  static updateSelectedVoipLineOption(value, offer, option) {
    if (option.optional === 2) {
      set(offer, 'firstVoipLineFull', value);
    } else if (option.optional === 98) {
      set(offer, 'lastVoipLineSelected', value);
    }
  }

  static showVoipLineOption(option, offer) {
    if (
      option.name === 'voip_line' &&
      ((option.optional === 2 && offer.lastVoipLineSelected === 0) ||
        (option.optional === 98 && offer.firstVoipLineFull === 2))
    ) {
      return true;
    }
    return false;
  }

  updateOfferPriceAndVoipLine(value, offer, option) {
    this.constructor.updateOfferDisplayedPrice(
      value,
      offer,
      option.name,
      option.optional,
    );
    this.constructor.updateSelectedVoipLineOption(value, offer, option);
  }

  selectOffer(offer) {
    if (!offer.modem) {
      set(offer, 'modemRequired', true);
      return null;
    }
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

    // Update modem rental from selected modem detail
    selectedOffer.modemOptions.forEach((modem) => {
      if (modem.name === selectedOffer.modem) {
        if (modem.price) {
          if (
            !selectedOffer.prices.modemRental.price ||
            selectedOffer.prices.modemRental.price.value !== modem.price.value
          ) {
            selectedOffer.prices.modemRental.price = modem.price;

            if (this.MODEM_LIST.includes(selectedOffer.modem)) {
              selectedOffer.needNewModem = true;
            }
          }
        } else {
          // Selected modem = no, no display shipping page
          selectedOffer.needNewModem = false;
        }
      }
    });

    this.loading.init = true;

    this.$http
      .post(
        `/pack/xdsl/${this.packName}/addressMove/servicesToDeleteUnpackTerms`,
        params,
      )
      .then((result) => {
        selectedOffer.subServicesToDelete = result.data;
        this.$scope.$emit('offerSelected', selectedOffer);
        return result.data;
      })
      .catch((error) => {
        // Display error message
        this.TucToast.error(
          this.$translate.instant('pack_move_choose_offer_error', {
            error,
          }),
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
    return null;
  }

  initModemOptions() {
    this.offers = this.offers.map((offer) => {
      Object.values(offer.modemOptions).forEach((option) => {
        let optionLabel = '';
        if (offer.needNewModem || !offer.prices.modemRental.price) {
          optionLabel = this.$translate.instant(
            `pack_move_modem_${option.name}`,
            {
              price: option.price ? option.price.text : '',
            },
          );
        } else if (
          this.MODEM_LIST.includes(option.name) &&
          offer.prices.modemRental.price.value === option.price.value
        ) {
          optionLabel = this.$translate.instant('pack_move_modem_keep', {
            price: option.price ? option.price.text : '',
          });
        } else {
          optionLabel = this.$translate.instant(
            `pack_move_modem_${option.name}`,
            {
              price: option.price ? option.price.text : '',
            },
          );
        }
        set(option, 'label', optionLabel);
        return option;
      });
      // Set modem option to the first value from modem options list
      set(offer, 'modem', offer.modemOptions[0].name);

      // Update price
      this.constructor.updateOfferDisplayedPrice(
        1,
        offer,
        this.MODEM_OPTION_NAME,
      );
      return offer;
    });
  }

  onChangeSelectModem(offer) {
    if (offer.modemRequired && offer.modem) {
      set(offer, 'modemRequired', false);
    }
    if (offer.modem) {
      this.constructor.updateOfferDisplayedPrice(
        1,
        offer,
        this.MODEM_OPTION_NAME,
      );
    }
  }
}
