import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import head from 'lodash/head';
import map from 'lodash/map';

import {
  ELIGIBILITY_LINE_STATUS,
  LINE_STATUS,
  OFFER_TYPE,
  STEPS,
} from './pack-move.constant';

export default class PackMoveCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    OvhApiXdsl,
    OvhApiPackXdsl,
    OvhApiPackXdslMove,
    OvhApiPackXdslTask,
    TucToast,
    TucToastError,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiPackXdslMove = OvhApiPackXdslMove;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.OvhApiPackXdslTask = OvhApiPackXdslTask;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiXdsl = OvhApiXdsl;
  }

  $onInit() {
    this.taskMovePendingName = 'pendingAddressMove';
    this.moveValidationPending = false;
    this.moveStep = STEPS.eligibility;

    this.steps = STEPS;

    this.operationAlreadyPending = false;

    this.packAdress = {
      loading: false,
      current: null,
    };

    this.testLine = {
      loading: false,
      lineNumber: null,
      canMove: false,
      performed: false,
    };

    this.method = 'number';

    this.offer = {
      available: [],
      current: {
        isLegacy: null,
      },
      selected: null,
    };

    this.packAddress = {
      loading: true,
    };
    this.loading = true;
    this.$q
      .all([
        this.isSlammingLine(),
        this.updateOperationAlreadyPending(),
        this.updateIsLegacyOffer(),
        this.getCurrentPackAddress(),
        this.getCurrentContactOwner(),
      ])
      .finally(() => {
        this.loading = false;
      });

    this.$scope.$on('eligibleSelectedLine', (event, selected) => {
      this.moveStep = STEPS.offers;
      this.selectedLine = selected.line;
      this.eligibilityReference = selected.line.eligibilityReference;
      this.eligibilityReferenceFiber = selected.line.eligibilityReferenceFiber;

      this.offer.selected = {
        address: selected.line.endpoint.address,
        portability: selected.line.endpoint.portability,
        copperInfo: selected.line.endpoint.copperInfo,
        moveOutDate: selected.moveOutDate,
        contactOwner: this.contactOwner,
        searchAddress: selected.line.searchAddress,
        building: selected.line.building,
      };
      if (selected.line.endpoint.neighbourAddress) {
        this.offer.selected.neighbourAddress =
          selected.line.endpoint.neighbourAddress;
      }
      if (this.selectedLine.status === ELIGIBILITY_LINE_STATUS.create) {
        this.offer.selected.futureLineNumber = null;
        this.isNewLine = true;
      } else {
        this.offer.selected.futureLineNumber = selected.line.endpoint.reference;
        this.isNewLine = false;
      }
    });

    this.$scope.$on('offerSelected', (event, offerSelected) => {
      this.offer.selected.offer = offerSelected;
      this.offersEligible = this.selectedLine.offers.filter((offer) =>
        offerSelected.productCodes.includes(offer.product.code),
      );
      const offerFTTH = this.offersEligible.find(
        (offer) => offer.product.type === OFFER_TYPE.ftth,
      );
      this.isOfferFTTH = !!offerFTTH;
      this.offer.selected.eligibilityReference = this.eligibilityReference;
      this.offer.selected.product = this.offersEligible[0].product;
      this.offer.selected.isOfferFTTH = this.isOfferFTTH;
      if (this.isOfferFTTH) {
        this.moveStep = STEPS.saveNumber;
        this.offer.selected.productCode = this.offersEligible[0].product.code;
        this.offer.selected.eligibilityReference = this.eligibilityReferenceFiber;
      } else if (this.offersEligible.length > 1) {
        this.moveStep = STEPS.unbundling;
      } else {
        this.moveStep = STEPS.saveNumber;
        this.offer.selected.productCode = this.offersEligible[0].product.code;
      }
    });
    this.$scope.$on('selectOfferUnbundling', (event, offerSelected) => {
      this.offer.selected.productCode = offerSelected.selected.productCode;
      this.moveStep = STEPS.saveNumber;
    });
    this.$scope.$on('savedNumber', (event, form) => {
      this.offer.selected.form = form;
      if (!this.isOfferFTTH) {
        if (this.offer.selected.offer.totalSubServiceToDelete > 0) {
          this.moveStep = STEPS.serviceDelete;
        } else if (this.offer.selected.offer.needNewModem) {
          this.moveStep = STEPS.shipping;
        } else if (this.isNewLine) {
          this.moveStep = STEPS.meeting;
        } else {
          this.moveStep = STEPS.resume;
        }
      } else {
        this.building = this.offer.selected.building;
        this.moveStep = STEPS.buildingDetails;
      }
    });
    this.$scope.$on('updateBuildingDetails', (event, selectedOffer) => {
      this.offer.selected.buildingDetails = selectedOffer;
      if (this.offer.selected.offer.totalSubServiceToDelete > 0) {
        this.moveStep = STEPS.serviceDelete;
      } else if (this.offer.selected.offer.needNewModem) {
        this.moveStep = STEPS.shipping;
      } else {
        this.moveStep = STEPS.resume;
      }
    });
    this.$scope.$on('subservicesDelete', (event, subServicesToDelete) => {
      this.offer.selected.offer.subServicesToDelete = subServicesToDelete;
      if (this.offer.selected.offer.needNewModem) {
        this.moveStep = STEPS.shipping;
      } else if (!this.isOfferFTTH && this.isNewLine) {
        this.moveStep = STEPS.meeting;
      } else {
        this.moveStep = STEPS.resume;
      }
    });
    this.$scope.$on('shippingSelected', (event, shipping) => {
      this.offer.selected.shipping = shipping;
      if (!this.isOfferFTTH && this.isNewLine) {
        this.moveStep = STEPS.meeting;
      } else {
        this.moveStep = STEPS.resume;
      }
    });
    this.$scope.$on('selectMeeting', (event, offerSelected) => {
      this.offer.selected.meetingSlots = offerSelected.meetingSlots;
      this.offer.selected.contactName = offerSelected.selected.contactName;
      this.moveStep = STEPS.resume;
    });
    this.$scope.$on('move', () => {
      this.TucToast.success(this.$translate.instant('pack_move_success'));
      this.goBack(this.packName);
    });
  }

  /**
   * Check is a pending move is on-going
   * @returns {Promise}
   */
  updateOperationAlreadyPending() {
    return this.OvhApiPackXdslTask.Aapi()
      .details({
        packName: this.packName,
      })
      .$promise.then((data) => {
        data.forEach((task) => {
          if (task.function === this.taskMovePendingName) {
            this.operationAlreadyPending = true;
          }
        });
      })
      .catch((error) => new this.TucToastError(error));
  }

  /**
   * Check is current offer is legacy
   * @returns {Promise}
   */
  updateIsLegacyOffer() {
    return this.OvhApiPackXdsl.v6()
      .get({
        packId: this.packName,
      })
      .$promise.then((data) => {
        this.offer.current.offerDescription = data.offerDescription;
        this.offer.current.offerPrice = data.offerPrice;
        this.offer.current.isLegacy = data.capabilities.isLegacyOffer;
        this.offer.current.isReseller = data.capabilities.isResellerOffer;
        this.offer.current.isFTTH = data.offerDescription.includes(
          OFFER_TYPE.ftth,
        );
      })
      .catch((error) => new this.TucToastError(error));
  }

  /**
   * Get the current pack address
   * @returns {Promise}
   */
  getCurrentPackAddress() {
    return this.$q
      .all([
        this.OvhApiPackXdsl.Aapi()
          .get({ packId: this.packName }, null)
          .$promise.then((pack) => {
            this.packAddress.current = head(pack.services);
            return this.packAddress.current
              ? this.packAddress.current.accessName
              : null;
          }),
        this.OvhApiPackXdsl.Aapi()
          .getLines({ packId: this.packName }, null)
          .$promise.then((lines) => {
            const currentLine = head(lines);
            this.packAddress.lineNumber = currentLine.number;
            this.packAddress.portability = currentLine.portability;
          }),
      ])
      .catch((error) => new this.TucToastError(error))
      .finally(() => {
        this.packAddress.loading = false;
      });
  }

  /**
   * Check if the line is slamming (meaning that customer cannot keep his phone number)
   * @return {Promise}
   */
  isSlammingLine() {
    this.slammingCheck = true;
    return this.OvhApiPackXdsl.v7()
      .access()
      .execute({
        packName: this.packName,
      })
      .$promise.then((ids) =>
        this.$q
          .all(
            map(
              chunk(ids, 200),
              (chunkIds) =>
                this.OvhApiXdsl.v7()
                  .query()
                  .batch('serviceName', [''].concat(chunkIds), ',')
                  .expand()
                  .execute().$promise,
            ),
          )
          .then((chunkResult) => flatten(chunkResult))
          .then((result) => flatten(result)),
      )
      .then((xdslLines) => {
        const slammingLines = filter(
          xdslLines,
          (xdslLine) => xdslLine.value.status === LINE_STATUS.slamming,
        );
        this.hasSlamming = !!slammingLines.length;
        return this.hasSlamming;
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('pack_move_slamming_error'),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.slammingCheck = false;
      });
  }

  /**
   * Retrieve contact owner associated to the pack if it exists
   */
  getCurrentContactOwner() {
    return this.OvhApiPackXdsl.v6()
      .getContactOwner({
        packName: this.packName,
      })
      .$promise.then((result) => {
        this.contactOwner = result.data;
        return this.contactOwner;
      })
      .catch(() => {
        this.contactOwner = null;
        return this.contactOwner;
      });
  }
}
