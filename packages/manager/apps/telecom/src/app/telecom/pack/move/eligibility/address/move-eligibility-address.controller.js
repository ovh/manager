import assign from 'lodash/assign';

import { AUTHORIZED_ABBREVIATIONS } from './move-eligibility-address.constants';
import { ELIGIBILITY_LINE_STATUS } from '../../pack-move.constant';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiConnectivityEligibility,
    OvhApiConnectivityEligibilitySearch,
    TucToast,
    tucValidator,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiConnectivityEligibility = OvhApiConnectivityEligibility;
    this.OvhApiConnectivityEligibilitySearch = OvhApiConnectivityEligibilitySearch;
    this.TucToast = TucToast;
    this.validator = tucValidator;
  }

  $onInit() {
    this.loaders = {};
    this.streets = [];
    this.displaySearch = true;
  }

  /**
   * Search city from a zip code
   * @param {String} zipcode Zip code
   */
  getCities(zipCode) {
    this.displaySearch = true;
    this.cities = null;
    this.address.city = null;
    this.address.streetNumber = null;
    this.address.street = null;
    this.displayResult = false;
    this.displaySearchResult = false;
    this.offersChange({
      OFFERS: [],
    });
    if (this.validator.tucIsZipcode(zipCode, ['metropolitanFrance'])) {
      this.loaders.cities = true;
      this.loading = true;
      return this.OvhApiConnectivityEligibilitySearch.v6()
        .searchCities(this.$scope, { zipCode })
        .then((cities) => {
          this.cities = cities.result;
          if (this.cities.length === 1) {
            [this.address.city] = this.cities;
            this.searchStreets();
          }
        })
        .catch(() => {
          this.TucToast.error(
            this.$translate.instant('pack_move_eligibility_zipcode_error', {
              zipCode,
            }),
          );
        })
        .finally(() => {
          delete this.loaders.cities;
          this.loading = false;
        });
    }

    return null;
  }

  searchStreets() {
    this.address.street = null;
    this.loadedStreets = [];
    this.loaders.streets = true;
    this.loading = true;
    return this.OvhApiConnectivityEligibilitySearch.v6()
      .searchStreets(this.$scope, {
        inseeCode: this.address.city.inseeCode,
      })
      .then((streets) => {
        this.loadedStreets = streets.result;
        return streets.result;
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant('pack_move_eligibility_street_error', {
            city: this.address.city,
          }),
        );
      })
      .finally(() => {
        delete this.loaders.streets;
        this.loading = false;
      });
  }

  /**
   * Propose streets from selected city
   * @param {String} partial Part of the name of the street
   * */
  getStreets(partial) {
    this.streets = [];
    const partialStreet = partial.replace(/^[\d\s,]*/, '');
    if (
      partialStreet.length > 2 ||
      AUTHORIZED_ABBREVIATIONS.includes(partialStreet)
    ) {
      this.loaders.streets = true;
      this.loading = true;

      // Filter loaded streets list with partial name
      this.streets = this.loadedStreets.filter((street) =>
        street.streetName.includes(partialStreet.toUpperCase()),
      );
      delete this.loaders.streets;
      this.loading = false;
    }

    return this.streets;
  }

  /**
   * Check that the street name match with a street object
   * @param {String} streetName Name of the street
   * @returns {boolean}
   */
  checkSelectedStreets(street) {
    return (
      street &&
      this.streets.some(({ streetName }) => streetName === street.streetName)
    );
  }

  /**
   * Copper eligibility by address
   */
  copperEligibilityByAddress() {
    return this.OvhApiConnectivityEligibilitySearch.v6()
      .searchLines(this.$scope, {
        streetCode: this.address.street.streetCode,
        streetNumber: this.address.streetNumber,
        ownerName: this.address.owner,
      })
      .then((data) => {
        if (data.result.length > 0) {
          const lines = {
            isAvailableLines: true,
            result: data.result,
          };
          return lines;
        }
        return this.OvhApiConnectivityEligibility.v6().testAddress(
          this.$scope,
          {
            streetCode: this.address.street.streetCode,
            streetNumber: this.address.streetNumber,
          },
        );
      })
      .then((res) => {
        if (res.isAvailableLines) {
          return res;
        }

        const elig = {
          isAvailableLines: false,
          result: res.result,
        };
        return elig;
      })
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  /**
   * Fiber eligibility by address
   */
  fiberEligibilityByAddress() {
    return this.OvhApiConnectivityEligibilitySearch.v6()
      .searchBuildings(this.$scope, {
        streetCode: this.address.street.streetCode,
        streetNumber: this.address.streetNumber,
      })
      .then((data) => {
        if (data.result.length > 0) {
          // Do an eligibility test on a building (fiber only)
          const buildings = data.result;
          const buildingsEligible = [];
          buildings.forEach((building, index) => {
            this.OvhApiConnectivityEligibility.v6()
              .testBuilding(this.$scope, {
                building: building.reference,
                index,
              })
              .then((elig) => {
                return buildingsEligible.push(elig);
              });
          });
          return buildingsEligible;
        }
        return null;
      })
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  /**
   * Launch eligibility by address
   * - retrieve fiber eligibility by address
   * - retrieve copper eligibility by address which can return lines associated to the address or nothing
   * - if no line, retrieve the copper eligibility by address and send offers to create new line to this address
   * - if lines, display them to the user
   */
  submitAddress() {
    this.displayResult = false;
    this.availableLines = null;
    this.loading = true;
    this.fiber = null;
    this.submited();

    this.offersChange({
      OFFERS: [],
    });

    this.fiberEligibilityByAddress().then((fibers) => {
      this.copperEligibilityByAddress().then((copper) => {
        if (fibers && fibers.length > 0) {
          this.checkFiberResult(fibers);
        } else {
          this.isFiberOffers = false;
        }

        // Cooper result
        if (copper.isAvailableLines) {
          // Display inactive lines found for this address
          this.availableLines = copper.result;
          this.isAvailableLine = true;
          this.displayResult = true;
          this.displaySearchResult = true;
          this.displaySearch = false;
          this.loading = false;
        } else {
          this.sendLineOffers(
            copper,
            this.fiber,
            'address',
            ELIGIBILITY_LINE_STATUS.create,
          );
          this.displayResult = true;
          this.displaySearchResult = true;
          this.displaySearch = false;
          this.loading = false;
        }
      });
    });
  }

  checkFiberResult(fibers) {
    if (fibers.length === 1) {
      const [fiber] = fibers;
      this.fiber = {
        eligibilityReferenceFiber: fiber.result.eligibilityReference,
        fiberInfo: fiber.result.endpoint.fiberInfo,
        referenceFiber: fiber.result.endpoint.reference,
        referenceTypeFiber: fiber.result.endpoint.referenceType,
        addressFiber: fiber.result.endpoint.address,
      };

      // Fiber result
      const fiberOffers = fiber.result.offers.filter(
        (offer) => offer.eligibility.eligible === true,
      );
      if (fiberOffers.length > 0) {
        this.fiber.offers = fiberOffers;
        this.isFiberOffers = true;
      } else {
        this.isFiberOffers = false;
      }
    } else {
      // Search offers eligible to fiber
      fibers.forEach((fiber) => {
        // Fiber result
        const fiberOffers = fiber.result.offers.filter(
          (offer) => offer.eligibility.eligible === true,
        );
        if (fiberOffers.length > 0) {
          this.fiber = {
            eligibilityReferenceFiber: fiber.result.eligibilityReference,
            fiberInfo: fiber.result.endpoint.fiberInfo,
            referenceFiber: fiber.result.endpoint.reference,
            referenceTypeFiber: fiber.result.endpoint.referenceType,
            addressFiber: fiber.result.endpoint.address,
          };
          this.fiber.offers = fiberOffers;
          this.isFiberOffers = true;
        }
        return fiber;
      });

      // There is no offers eligible to fiber but there are fiber infos,
      // initialize fiber with first value from table
      if (!this.fiber) {
        const [fiber] = fibers;
        this.fiber = {
          eligibilityReferenceFiber: fiber.result.eligibilityReference,
          fiberInfo: fiber.result.endpoint.fiberInfo,
          referenceFiber: fiber.result.endpoint.reference,
          referenceTypeFiber: fiber.result.endpoint.referenceType,
          addressFiber: fiber.result.endpoint.address,
        };
        this.isFiberOffers = false;
      }
    }
  }

  /**
   * Create the offer response which is sent to the move-eligilibility controller
   * @param { Object } copper copper eligibility result
   * @param { Object } fiber fiber eligibility result
   * @param { Object } eligType type of eligibility: 'address' | 'number'
   * @param { Object } status status of the line: 'active' | 'inactive' | 'create'
   */
  sendLineOffers(copper, fiber, eligType, status) {
    const copperOffers = copper.result.offers.filter(
      (offer) => offer.eligibility.eligible === true,
    );
    const offer = {
      eligType,
      status,
      eligibilityReference: copper.result.eligibilityReference,
      offers: copperOffers,
      endpoint: {
        copperInfo: copper.result.endpoint.copperInfo,
        portability: copper.result.endpoint.portability,
        reference: copper.result.endpoint.reference,
        referenceType: copper.result.endpoint.referenceType,
      },
    };
    if (fiber) {
      if (copper.result.endpoint.address !== fiber.addressFiber) {
        assign(offer.endpoint, {
          address: fiber.addressFiber,
          neighbourAddress: copper.result.endpoint.address,
        });
      } else {
        assign(offer.endpoint, {
          address: copper.result.endpoint.address,
        });
      }
      offer.buildingReference = fiber.fiberInfo.buildingReference;
    } else {
      assign(offer.endpoint, {
        address: copper.result.endpoint.address,
      });
    }

    if (this.isFiberOffers) {
      offer.eligibilityReferenceFiber = fiber.eligibilityReferenceFiber;
      offer.offers = [...copperOffers, ...fiber.offers];
      assign(offer.endpoint, {
        fiberInfo: fiber.fiberInfo,
        referenceFiber: fiber.referenceFiber,
        referenceTypeFiber: fiber.referenceTypeFiber,
      });
    }
    this.offersChange({
      OFFERS: [offer],
    });
  }

  createLine() {
    this.loading = true;
    return this.OvhApiConnectivityEligibility.v6()
      .testAddress(this.$scope, {
        streetCode: this.address.street.streetCode,
        streetNumber: this.address.streetNumber,
      })
      .then((res) => {
        this.sendLineOffers(
          res,
          this.fiber,
          'address',
          ELIGIBILITY_LINE_STATUS.create,
        );
        this.displayResult = false;
        return res;
      })
      .catch((error) => {
        this.TucToast.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  testLineEligibility(row) {
    this.loading = true;
    const lineNumber = row.lineNumber.replace(/[^0-9]/g, '');
    const { status } = row.copperInfo;

    return this.OvhApiConnectivityEligibility.v6()
      .testLine(this.$scope, {
        lineNumber,
        status,
      })
      .then((copper) => {
        this.sendLineOffers(copper, this.fiber, 'number', status);
        this.displayResult = false;
      })
      .catch((error) => {
        this.TucToast.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
