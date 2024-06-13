import find from 'lodash/find';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

import {
  PROMO_DISPLAY,
  MODEM_LIST,
  MODEM_OPTION_NAME,
  GTR_NONE,
  OFFER_XDSL,
  OFFER_FIBER,
  GRT,
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
    this.GTR_NONE = GTR_NONE;
    this.OFFER_XDSL = OFFER_XDSL;
    this.OFFER_FIBER = OFFER_FIBER;
    this.GRT = GRT;
    this.process = null;
    this.loading = {
      init: true,
    };

    return this.TucPackMigrationProcess.initOffersView()
      .then((migrationProcess) => {
        this.process = migrationProcess;
        this.initializeModemOptions();
        this.setGtrOptions();
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

    offer.modemOptions.forEach((modem) => {
      if (modem.name === offer.modem && modem.price) {
        totalOfferPrice += modem.price.value;
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
      if (option.name.startsWith('gtr_') && option.selected !== null) {
        if (optionName.startsWith('gtr_')) {
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
        if (optionName === GTR_NONE) {
          set(option, 'selected', false);
        }
      }
    });
  }

  updateOfferPriceAndGtr(offer) {
    this.constructor.updateSelectedGtrOption(offer, offer.gtrSelected);
    this.updateOfferDisplayedPrice(1, offer, offer.gtrSelected);
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
        if (modem.price) {
          if (
            !selectedOffer.modemRental ||
            selectedOffer.modemRental.value !== modem.price.value
          ) {
            selectedOffer.modemRental = modem.price;

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

    // Update meeting flag if xDSL => fiber offer
    if (
      this.process.pack.offerDescription
        .toLowerCase()
        .includes(this.OFFER_XDSL) &&
      selectedOffer.offerName.toLowerCase().includes(this.OFFER_FIBER)
    ) {
      set(selectedOffer, 'needMeeting', true);
    }

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

  initializeModemOptions() {
    this.process.migrationOffers.result.offers = this.process.migrationOffers.result.offers.map(
      (offer) => {
        Object.values(offer.modemOptions).forEach((option) => {
          let optionLabel = '';
          if (offer.needNewModem || !offer.modemRental) {
            optionLabel = this.$translate.instant(
              `telecom_pack_migration_modem_${option.name}`,
              {
                price: option.price ? option.price.text : '',
              },
            );
          } else if (
            this.MODEM_LIST.includes(option.name) &&
            offer.modemRental.value === option.price.value
          ) {
            optionLabel = this.$translate.instant(
              'telecom_pack_migration_modem_keep',
              { price: option.price ? option.price.text : '' },
            );
          } else {
            optionLabel = this.$translate.instant(
              `telecom_pack_migration_modem_${option.name}`,
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
        this.updateOfferDisplayedPrice(1, offer, this.MODEM_OPTION_NAME);
        return offer;
      },
    );
  }

  setGtrOptions() {
    // Check if current offer has a GRT option set
    this.isGrt = !!Object.keys(this.process.pack.options).find((value) =>
      value.includes(this.GRT),
    );

    // Retrieve current offer technology: xdsl or fiber
    this.currentOfferTechno = this.process.pack.offerDescription
      .toLowerCase()
      .includes(this.OFFER_XDSL)
      ? this.OFFER_XDSL
      : this.OFFER_FIBER;

    this.process.migrationOffers.result.offers = this.process.migrationOffers.result.offers.map(
      (offer) => {
        // Retrieve offer technology: xdsl or fiber
        const offerTechno = offer.offerName
          .toLowerCase()
          .includes(this.OFFER_XDSL)
          ? this.OFFER_XDSL
          : this.OFFER_FIBER;

        const gtr = Object.values(offer.options)
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

        if (this.isGrt && this.currentOfferTechno === offerTechno) {
          this.grtLabel = `telecom_pack_migration_${gtr[0].name}`;
          this.grtLabelPrice = gtr[0].optionalPrice.text;

          // Initialize GTR selected to first value
          set(offer, 'gtrSelected', gtr[0].name);
          this.updateOfferPriceAndGtr(offer);

          // Update displayed price for current offer
          const totalCurrentPrice =
            offer.currentOfferPrice.value + gtr[0].optionalPrice.value;
          this.process.pack.displayedCurrentPrice = this.TucPackMigrationProcess.getPriceStruct(
            totalCurrentPrice,
          );
        } else if (gtr.length > 0) {
          // Initialize GTR options with a none value
          gtr.unshift({
            name: this.GTR_NONE,
            label: this.$translate.instant('telecom_pack_migration_no_gtr'),
          });
        }
        set(offer, 'gtrOptions', gtr);
        return offer;
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
