import assign from 'lodash/assign';
import filter from 'lodash/filter';
import map from 'lodash/map';
import set from 'lodash/set';
import values from 'lodash/values';

import { PROMO_DISPLAY } from '../pack-move.constant';

export default class MoveResumeCtrl {
  /* @ngInject */
  constructor($scope, $timeout, $translate, OvhApiPackXdslMove, TucToast) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.OvhApiPackXdslMove = OvhApiPackXdslMove;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.loading = false;
    this.model = {
      acceptContracts: false,
    };
    this.PROMO_DISPLAY = PROMO_DISPLAY;

    this.modemTransportPrice = 9.99;
    this.choosedAdditionalOptions = filter(
      values(this.offer.selected.offer.options),
      (option) =>
        option.optional && option.choosedValue > 0 && option.name !== 'gtr_ovh',
    );

    const modemRental = this.offer.selected.offer.prices.modemRental.price
      ? this.offer.selected.offer.prices.modemRental.price.value
      : 0;
    const firstYearPromo = this.offer.selected.offer.prices.firstYearPromo.price
      ? this.offer.selected.offer.prices.price.price.value -
        this.offer.selected.offer.prices.firstYearPromo.price.value
      : 0;

    this.firstYearPromo = firstYearPromo;

    let displayedPrice;
    if (this.choosedAdditionalOptions.length === 0) {
      let totalOfferPrice = 0;
      totalOfferPrice =
        this.offer.selected.offer.prices.price.price.value -
        firstYearPromo +
        modemRental;
      displayedPrice = this.getDisplayedPrice(totalOfferPrice);
      set(this.offer.selected.offer, 'displayedPrice', displayedPrice);
    } else {
      let totalOfferPrice = this.offer.selected.offer.displayedPrice.value;
      totalOfferPrice = totalOfferPrice - firstYearPromo + modemRental;
      this.offer.selected.offer.displayedPrice = this.getDisplayedPrice(
        totalOfferPrice,
      );
    }

    if (this.offer.selected.contactOwner) {
      this.contactPhone = this.offer.selected.contactOwner.phone;
    }
  }

  getDisplayedPrice(value) {
    return {
      currencyCode: this.offer.selected.offer.prices.price.price
        ? this.offer.selected.offer.prices.price.price.currencyCode
        : 'EUR',
      text: this.offer.selected.offer.prices.price.price
        ? this.offer.selected.offer.prices.price.price.text.replace(
            /\d+(?:[.,]\d+)?/,
            value.toFixed(2),
          )
        : value.toFixed(2),
      value,
    };
  }

  getOptionPrice(option) {
    const value = option.optionalPrice.value * option.choosedValue;
    return this.getPriceStruct(value);
  }

  getPriceStruct(value, isNegative) {
    let priceText = this.offer.current.offerPrice.text.replace(
      /\d+(?:[.,]\d+)?/,
      value.toFixed(2),
    );
    if (isNegative) {
      priceText = `- ${priceText}`;
    }
    return {
      currencyCode: this.offer.current.offerPrice.currencyCode,
      text: priceText,
      value,
    };
  }

  getFirstMensuality() {
    return this.getPriceStruct(
      this.offer.selected.offer.displayedPrice.value + 9.99,
    );
  }

  getMeeting() {
    const day = moment(this.offer.selected.meetingSlots.slot.startDate).format(
      'DD/MM/YYYY',
    );
    const start = moment(this.offer.selected.meetingSlots.slot.startDate)
      .utc()
      .format('HH:mm');
    const end = moment(this.offer.selected.meetingSlots.slot.endDate)
      .utc()
      .format('HH:mm');
    return this.$translate.instant('pack_move_contract_meeting', {
      day,
      start,
      end,
    });
  }

  getMoveOutDate() {
    return this.$translate.instant('pack_move_resume_move_out_date', {
      moveOutDate: moment(this.offer.selected.moveOutDate, 'YYYY-MM-DD').format(
        'DD/MM/YYYY',
      ),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  checkContactPhone(value) {
    if (value) {
      return !!(
        value.match(/^\+?(\d|\.| |#|-)+$/) &&
        value.length < 26 &&
        value.length > 2
      );
    }
    return true;
  }

  /**
   * Move the pack !
   * The post need the poll of the task (by repost),
   * this made by recursive call of this function
   *
   * @returns {void}
   */
  moveThePack(moveDataParams) {
    let moveData = moveDataParams;
    this.loading = true;

    if (!moveData) {
      moveData = {
        offerName: this.offer.selected.offer.offerName,
        productCode: this.offer.selected.productCode,
        keepCurrentNumber: this.offer.selected.form.currentLandline
          .portLineNumber,
        eligibilityReference: this.offer.selected.eligibilityReference,
        engageMonths: this.offer.selected.offer.engageMonths,
        acceptContracts: this.offer.selected.acceptContracts,
      };

      if (this.offer.selected.buildingDetails) {
        assign(moveData, {
          buildingReference: this.offer.selected.buildingDetails
            .buildingReference,
          floor: this.offer.selected.buildingDetails.floor,
          stair: this.offer.selected.buildingDetails.stair,
          otp: this.offer.selected.buildingDetails.pto,
        });
        // OTP Reference
        if (
          this.offer.selected.buildingDetails.pto &&
          this.offer.selected.buildingDetails.ptoReference
        ) {
          assign(moveData, {
            otpReference: this.offer.selected.buildingDetails.ptoReference,
          });
        }
      } else {
        assign(moveData, {
          otp: false,
        });
      }

      // shipping post params
      if (
        this.offer.selected.offer.needNewModem &&
        this.offer.selected.shipping.mode === 'mondialRelay'
      ) {
        moveData.mondialRelayId = this.offer.selected.shipping.relay.id;
      } else if (
        this.offer.selected.offer.needNewModem &&
        this.offer.selected.shipping.mode === 'transporter'
      ) {
        moveData.nicShipping = this.offer.selected.shipping.address.id;
      }

      const moveOptions = map(
        filter(
          values(this.offer.selected.offer.options),
          (option) =>
            option.optional &&
            option.choosedValue > 0 &&
            option.name !== 'gtr_ovh',
        ),
        (option) => ({
          name: option.name,
          quantity: option.choosedValue,
        }),
      );
      if (
        this.offer.selected.offer.options.gtr_ovh &&
        this.offer.selected.offer.options.gtr_ovh.selected
      ) {
        moveOptions.push({
          name: 'gtr_ovh',
          quantity: 1,
        });
      }
      moveData.options = moveOptions;

      // sub service to delete post params
      if (this.offer.selected.offer.subServicesToDelete.length) {
        moveData.subServicesToDelete = [];
        this.offer.selected.offer.subServicesToDelete.forEach((subService) => {
          moveData.subServicesToDelete = moveData.subServicesToDelete.concat(
            map(
              filter(subService.services, {
                selected: true,
              }),
              (service) => ({
                service: service.name,
                type: subService.type,
              }),
            ),
          );
        });
      }

      if (this.offer.selected.moveOutDate) {
        const moveOutDate = new Date(this.offer.selected.moveOutDate);
        assign(moveData, {
          moveOutDate,
        });
      }

      // Set contact phone if is set
      if (this.contactPhone) {
        assign(moveData, {
          contactPhone: this.contactPhone,
        });
      }

      if (this.offer.selected.meetingSlots) {
        // Set meetings for copper line creation if is set
        const meeting = {
          fakeMeeting: this.offer.selected.meetingSlots.fakeMeeting,
          meetingSlot: {
            endDate: this.offer.selected.meetingSlots.slot.endDate,
            startDate: this.offer.selected.meetingSlots.slot.startDate,
            uiCode: this.offer.selected.meetingSlots.slot.uiCode,
          },
          name: this.offer.selected.contactName,
        };
        assign(moveData, {
          meeting,
        });

        // Set address complements for copper line creation if set
        if (this.offer.selected.searchAddress.residence) {
          Object.assign(moveData, {
            residence: this.offer.selected.searchAddress.residence,
          });
        }

        if (
          this.offer.selected.neighbourAddress &&
          this.offer.selected.neighbourAddress.floor
        ) {
          assign(moveData, {
            floor: this.offer.selected.neighbourAddress.floor,
          });
        } else if (this.offer.selected.address.floor) {
          assign(moveData, {
            floor: this.offer.selected.address.floor,
          });
        } else if (this.offer.selected.searchAddress.floor) {
          assign(moveData, {
            floor: this.offer.selected.searchAddress.floor,
          });
        }

        if (
          this.offer.selected.neighbourAddress &&
          this.offer.selected.neighbourAddress.door
        ) {
          assign(moveData, {
            door: this.offer.selected.neighbourAddress.door,
          });
        } else if (this.offer.selected.address.door) {
          assign(moveData, {
            door: this.offer.selected.address.door,
          });
        } else if (this.offer.selected.searchAddress.door) {
          assign(moveData, {
            door: this.offer.selected.searchAddress.door,
          });
        }

        if (
          this.offer.selected.neighbourAddress &&
          this.offer.selected.neighbourAddress.stairs
        ) {
          assign(moveData, {
            stair: this.offer.selected.neighbourAddress.stairs,
          });
        } else if (this.offer.selected.address.stairs) {
          assign(moveData, {
            stair: this.offer.selected.address.stairs,
          });
        } else if (this.offer.selected.searchAddress.stairs) {
          assign(moveData, {
            stair: this.offer.selected.searchAddress.stairs,
          });
        }
      } else if (!this.offer.selected.isFTTH) {
        assign(moveData, {
          meeting: {
            fakeMeeting: true,
          },
        });
      }

      // The post data need to be sealed for to be exactly the same at each post
      moveData = angular.copy(moveData);

      this.moveValidationPending = true;
    }

    return this.OvhApiPackXdslMove.v6()
      .moveOffer(
        {
          packName: this.packName,
        },
        moveData,
      )
      .$promise.then((data) => {
        switch (data.status) {
          case 'pending':
            this.$timeout(() => {
              this.moveThePack(moveData);
            }, 1000);
            this.loading = true;
            break;

          case 'error':
            this.$translate('pack_move_cannot_validate_move', {
              message: data.error,
            }).then((translation) => {
              this.TucToast.error(translation, { hideAfter: false });
            });

            this.moveValidationError = true;
            this.moveValidationPending = false;
            this.moveValidationSuccess = false;
            this.loading = false;
            break;

          default:
            this.moveValidationError = false;
            this.moveValidationPending = false;
            this.moveValidationSuccess = true;
            this.loading = false;
            this.$scope.$emit('move');
            break;
        }
      })
      .catch((error) => {
        const message = [];

        if (error) {
          if (error.statusText) {
            message.push(error.statusText);
          }

          if (error.data && error.data.message) {
            message.push(error.data.message);
          }
        }

        this.$translate('pack_move_cannot_validate_move', {
          message: message.join(' '),
        }).then((translation) => {
          this.TucToast.error(translation, { hideAfter: false });
        });

        this.moveValidationPending = false;
        this.loading = false;
      });
  }

  /**
   * Launch the move
   */
  launchMovePack() {
    this.offer.selected.acceptContracts = this.model.acceptContracts;
    if (this.moveValidationError) {
      this.moveValidationError = false;
      return;
    }
    this.moveThePack();
  }

  // eslint-disable-next-line class-methods-use-this
  getServiceToDeleteList(subService) {
    return map(
      filter(subService.services, {
        selected: true,
      }),
      'name',
    ).join(', ');
  }
}
