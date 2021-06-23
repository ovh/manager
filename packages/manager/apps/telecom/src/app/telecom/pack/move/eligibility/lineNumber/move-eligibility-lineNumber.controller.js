import { ELIGIBILITY_LINE_STATUS } from '../../pack-move.constant';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiConnectivityEligibility,
    OvhApiConnectivityEligibilitySearch,
    TucToast,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiConnectivityEligibility = OvhApiConnectivityEligibility;
    this.OvhApiConnectivityEligibilitySearch = OvhApiConnectivityEligibilitySearch;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.STATUS = ELIGIBILITY_LINE_STATUS;
    this.checkLine = {
      lineNumber: '',
    };
    this.phoneNumberRegex = '^0[1-5]([\\s\\-]?([0-9]){2}){4}$';
  }

  /**
   * Test line copper for the line number and status
   * @param { String } lineNumber phone number to check eligibility
   * @param { String } status status of the line: 'active' | 'inactive'
   */
  testLine(lineNumber, status) {
    if (this.isReseller) {
      // If current offer is a reseller offer,
      // launch eligibility test line for partners (reseller)
      return this.OvhApiConnectivityEligibility.v6().testLinePartners(
        this.$scope,
        {
          lineNumber,
          status,
        },
      );
    }
    return this.OvhApiConnectivityEligibility.v6().testLine(this.$scope, {
      lineNumber,
      status,
    });
  }

  /**
   * Retrieve line copper for the line number and status
   * @param { String } lineNumber phone number to check eligibility
   * @param { String } status status of the line: 'active' | 'inactive'
   */
  getLineCopper(lineNumber, status) {
    return this.testLine(lineNumber, status).catch((error) => {
      this.loading = false;
      this.TucToast.error(error);
    });
  }

  fiberSearchBuildingByNumber(lineNumber, status) {
    return this.OvhApiConnectivityEligibilitySearch.v6()
      .searchBuildingByLines(this.$scope, { lineNumber, status })
      .then((data) => {
        return data.result.length > 0 ? data.result : null;
      })
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  fiberEligibilityByBuilding(buildingRef) {
    return this.OvhApiConnectivityEligibility.v6()
      .testBuilding(this.$scope, {
        building: buildingRef,
      })
      .then((elig) => {
        return elig;
      })
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  testBuilding(building) {
    this.loading = true;
    return this.fiberEligibilityByBuilding(building.reference)
      .then((fiber) => {
        const offer = this.selectedOffer;
        if (fiber) {
          const fiberOffers = fiber.result.offers.filter(
            (el) => el.eligibility.eligible === true,
          );
          const copperOffers = offer.offers;
          if (fiberOffers.length > 0) {
            offer.offers = [...copperOffers, ...fiberOffers];
            offer.eligibilityReferenceFiber = fiber.result.eligibilityReference;
            offer.endpoint.fiberInfo = fiber.result.endpoint.fiberInfo;
            offer.endpoint.referenceFiber = fiber.result.endpoint.reference;
            offer.endpoint.referenceTypeFiber =
              fiber.result.endpoint.referenceType;
          }
          offer.buildingReference =
            fiber.result.endpoint.fiberInfo.buildingReference;
        }
        offer.building = building;
        this.offersChange({
          OFFERS: [offer],
        });
        return offer;
      })
      .catch((error) => {
        this.TucToast.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getFiberEligibility(copperOffer) {
    const offer = copperOffer;
    this.displayFirstStep = false;
    this.loading = true;
    // Second step : fiber eligibility by number and status selected
    return this.fiberSearchBuildingByNumber(this.lineNumber, offer.status)
      .then((buildings) => {
        this.buildingsList = buildings && buildings.length > 0 ? buildings : [];
        const copperOffers = offer.offers;
        if (buildings) {
          if (buildings.length === 1) {
            const [building] = buildings;
            return this.fiberEligibilityByBuilding(building.reference).then(
              (fiber) => {
                if (fiber) {
                  const fiberOffers = fiber.result.offers.filter(
                    (el) => el.eligibility.eligible === true,
                  );
                  if (fiberOffers.length > 0) {
                    offer.offers = [...copperOffers, ...fiberOffers];
                    offer.eligibilityReferenceFiber =
                      fiber.result.eligibilityReference;
                    offer.endpoint.fiberInfo = fiber.result.endpoint.fiberInfo;
                    offer.endpoint.referenceFiber =
                      fiber.result.endpoint.reference;
                    offer.endpoint.referenceTypeFiber =
                      fiber.result.endpoint.referenceType;
                  }
                  offer.buildingReference =
                    fiber.result.endpoint.fiberInfo.buildingReference;
                }
                offer.building = building;

                // Display the result for offerChange
                this.offersChange({
                  OFFERS: [offer],
                });
                return offer;
              },
            );
          }
          this.selectedOffer = offer;
        } else {
          // Display the result for offerChange
          this.offersChange({
            OFFERS: [offer],
          });
        }
        return offer;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  testLineEligibility() {
    this.loading = true;
    this.offersChange({ OFFERS: [] });
    this.copperOffers = [];
    this.displayFirstStep = false;

    this.lineNumber = this.checkLine.lineNumber.replace(/[^0-9]/g, '');
    this.buildingsList = {};

    return this.getLineCopper(
      this.lineNumber,
      ELIGIBILITY_LINE_STATUS.active,
    ).then((copperActive) => {
      const active = {
        eligType: 'number',
        status: ELIGIBILITY_LINE_STATUS.active,
        eligibilityReference: '',
        endpoint: '',
        offers: '',
        errorMessage: '',
      };

      if (copperActive.status === 'error') {
        active.errorMessage = copperActive.error;
      } else {
        const copperActiveOffers = copperActive.result.offers.filter(
          (offer) => offer.eligibility.eligible === true,
        );
        active.eligibilityReference = copperActive.result.eligibilityReference;
        active.endpoint = copperActive.result.endpoint;
        active.offers = copperActiveOffers;
      }
      this.copperOffers.push(active);

      return this.getLineCopper(
        this.lineNumber,
        ELIGIBILITY_LINE_STATUS.inactive,
      ).then((copperInactive) => {
        const inactive = {
          eligType: 'number',
          status: ELIGIBILITY_LINE_STATUS.inactive,
          eligibilityReference: '',
          endpoint: '',
          offers: '',
          errorMessage: '',
        };

        if (copperInactive.status === 'error') {
          inactive.errorMessage = copperInactive.error;
        } else {
          const copperInactiveOffers = copperInactive.result.offers.filter(
            (offer) => offer.eligibility.eligible === true,
          );
          inactive.eligibilityReference =
            copperInactive.result.eligibilityReference;
          inactive.endpoint = copperInactive.result.endpoint;
          inactive.offers = copperInactiveOffers;
        }
        this.copperOffers.push(inactive);
        this.displayFirstStep = true;

        this.loading = false;
      });
    });
  }
}
