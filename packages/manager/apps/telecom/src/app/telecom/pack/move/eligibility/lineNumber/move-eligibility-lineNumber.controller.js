import { ELIGIBILITY_LINE_STATUS } from '../../pack-move.constant';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    OvhApiConnectivityEligibility,
    OvhApiConnectivityEligibilitySearch,
    TucToast,
  ) {
    this.$scope = $scope;
    this.OvhApiConnectivityEligibility = OvhApiConnectivityEligibility;
    this.OvhApiConnectivityEligibilitySearch = OvhApiConnectivityEligibilitySearch;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.checkLine = {
      lineNumber: '',
    };
    this.phoneNumberRegex = '^0[1-5]([\\s\\-]?([0-9]){2}){4}$';
  }

  /**
   * Retrieve eligibility (copper and fiber) for the line number
   * @param { String } lineNumber phone number to check eligibility
   * @param { String } status status of the line: 'active' | 'inactive'
   */
  eligibilityByNumber(lineNumber, status) {
    // First copper eligibility by number
    return this.OvhApiConnectivityEligibility.v6()
      .testLine(this.$scope, {
        lineNumber,
        status,
      })
      .then((copper) => {
        if (copper.status === 'error') {
          const offer = {
            eligType: 'number',
            status,
            eligibilityReference: '',
            endpoint: '',
            offers: '',
            errorMessage: copper.error,
          };
          return offer;
        }
        // Second fiber eligibility by number
        return this.fiberEligibilityByNumber(lineNumber, status).then(
          (fiber) => {
            const copperOffers = copper.result.offers.filter(
              (offer) => offer.eligibility.eligible === true,
            );
            const offer = {
              eligType: 'number',
              status,
              eligibilityReference: copper.result.eligibilityReference,
              endpoint: copper.result.endpoint,
              offers: copperOffers,
              errorMessage: '',
            };
            if (fiber) {
              const fiberOffers = fiber.result.offers.filter(
                (el) => el.eligibility.eligible === true,
              );
              if (fiberOffers.length > 0) {
                offer.offers = [...copperOffers, ...fiberOffers];
                offer.eligibilityReferenceFiber =
                  fiber.result.eligibilityReference;
                offer.endpoint.fiberInfo = fiber.result.endpoint.fiberInfo;
                offer.endpoint.referenceFiber = fiber.result.endpoint.reference;
                offer.endpoint.referenceTypeFiber =
                  fiber.result.endpoint.referenceType;
              }
              offer.buildingReference =
                fiber.result.endpoint.fiberInfo.buildingReference;
            }
            return offer;
          },
        );
      })
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  fiberEligibilityByNumber(lineNumber, status) {
    return this.OvhApiConnectivityEligibilitySearch.v6()
      .searchBuildingByLines(this.$scope, {
        lineNumber,
        status,
      })
      .then((data) => {
        if (data.result.length > 0) {
          // Do an eligibility test on a building (fiber only)
          const [building] = data.result;
          return this.OvhApiConnectivityEligibility.v6()
            .testBuilding(this.$scope, {
              building: building.reference,
            })
            .then((elig) => {
              return elig;
            })
            .catch((error) => {
              this.loading = false;
              this.TucToast.error(error);
            });
        }
        return null;
      })
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  testLineEligibility() {
    this.loading = true;
    this.offersChange({ OFFERS: [] });
    this.lineNumber = this.checkLine.lineNumber.replace(/[^0-9]/g, '');
    this.submited();

    this.eligibilityByNumber(
      this.lineNumber,
      ELIGIBILITY_LINE_STATUS.active,
    ).then((activeOffers) => {
      if (activeOffers.errorMessage) {
        this.eligibilityByNumber(
          this.lineNumber,
          ELIGIBILITY_LINE_STATUS.inactive,
        ).then((inactiveOffers) => {
          if (!inactiveOffers.errorMessage) {
            this.offersChange({
              OFFERS: [inactiveOffers],
            });
          } else {
            const noOffer = {
              eligType: 'number',
              errorMessage: 'pack_move_eligibility_line_no_offers',
            };
            this.offersChange({
              OFFERS: [noOffer],
            });
          }
          this.loading = false;
        });
      } else {
        this.offersChange({
          OFFERS: [activeOffers],
        });
        this.loading = false;
      }
    });
  }
}
