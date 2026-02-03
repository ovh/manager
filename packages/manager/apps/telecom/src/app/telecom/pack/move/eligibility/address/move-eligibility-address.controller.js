import {
  AUTHORIZED_ABBREVIATIONS,
  BUILDING,
} from './move-eligibility-address.constants';
import { ELIGIBILITY_LINE_STATUS } from '../../pack-move.constant';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    moveEligibilityAddressService,
    OvhApiConnectivityEligibility,
    OvhApiConnectivityEligibilitySearch,
    TucToast,
    tucValidator,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.moveEligibilityAddressService = moveEligibilityAddressService;
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
   * @param {String} street Name of the street
   * @returns {boolean}
   */
  checkSelectedStreets(street) {
    this.getStreetNumbers();
    return (
      street &&
      this.streets.some(({ streetName }) => streetName === street.streetName)
    );
  }

  /**
   * Get street numbers from the street
   */
  getStreetNumbers() {
    if (this.address.street && this.address.street.streetCode) {
      this.searchStreetNumbers(
        this.address.street.streetCode,
        this.address.street.streetAltCode,
      );
    }
  }

  /**
   * Search street numbers from the selected street
   * @param {String} streetCode street code of the selected street
   */
  searchStreetNumbers(streetCode, streetAltCode) {
    this.address.numberStreet = null;
    this.loaders.streetNumbers = true;
    this.loading = true;
    this.moveEligibilityAddressService
      .searchStreetNumber(streetCode, streetAltCode)
      .then((response) => {
        if (response.status === 'pending') {
          setTimeout(() => {
            this.searchStreetNumbers(streetCode, streetAltCode);
          }, 5000);
        } else {
          this.streetNumbers = response.result;
          delete this.loaders.streetNumbers;
          this.loading = false;
        }
      });
  }

  /**
   * Copper eligibility by address
   */
  copperEligibilityByAddress() {
    return this.moveEligibilityAddressService
      .testAddress(
        this.address.streetNumber.hexacle,
        this.address.street.streetAltCode,
        this.address.street.streetCode,
        this.address.streetNumber.number,
        this.isReseller,
      )
      .then(({ result }) => ({ result }))
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
        return Promise.reject(error);
      });
  }

  /**
   * Retrieve buildings for the address
   */
  searchBuildings() {
    return this.moveEligibilityAddressService
      .searchBuildings(
        this.address.streetNumber.hexacle,
        this.address.street.streetAltCode,
        this.address.street.streetCode,
        this.address.streetNumber.number,
      )
      .then((response) => {
        if (response.status === 'pending') {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              this.searchBuildings()
                .then(resolve)
                .catch(reject);
            }, 5000);
          });
        }
        return response.result;
      })
      .catch(() => {
        this.loading = false;
        this.TucToast.error(
          this.$translate.instant('pack_move_eligibility_building_error'),
        );
      });
  }

  /**
   * Select building from the list
   * @param {*} building
   */
  testBuilding(building) {
    this.loading = true;
    return this.testFiberEligibility(building.reference).then(() => {
      this.displayListOfBuildings = false;
      return this.handleEligibilityResult(building);
    });
  }

  /**
   * Handle eligibility result after fiber test
   * @param {*} building
   */
  handleEligibilityResult(building) {
    // Explicit verification of fiber optic offers
    const hasFiberOffers = this.fiber?.offers?.length > 0;

    // Copper test only if no fiber offer is available
    if (!hasFiberOffers) {
      return this.copperEligibilityByAddress()
        .then((copper) => {
          this.sendLineOffers(
            copper,
            this.fiber,
            'address',
            ELIGIBILITY_LINE_STATUS.create,
            building,
          );
          this.displayResult = true;
          this.displaySearchResult = true;
          this.displaySearch = false;
          this.loading = false;
        })
        .catch((error) => {
          this.displayResult = false;
          this.displaySearchResult = false;
          this.loading = false;
          this.TucToast.error(error);
        });
    }

    // Fiber offers available, ignore the copper test
    this.sendLineOffers(
      null,
      this.fiber,
      'address',
      ELIGIBILITY_LINE_STATUS.create,
      building,
    );
    this.displayResult = true;
    this.displaySearchResult = true;
    this.displaySearch = false;
    this.loading = false;

    return Promise.resolve();
  }

  /**
   * Fiber eligibility by building
   */
  testFiberEligibility(buildingRef) {
    return this.OvhApiConnectivityEligibility.v6()
      .testBuilding(this.$scope, {
        building: buildingRef,
      })
      .then((elig) => {
        if (elig.result) {
          const fiber = elig.result;
          this.fiber = {
            eligibilityReferenceFiber: fiber.eligibilityReference,
            fiberInfo: fiber.endpoint.fiberInfo,
            referenceFiber: fiber.endpoint.reference,
            referenceTypeFiber: fiber.endpoint.referenceType,
            addressFiber: fiber.endpoint.address,
          };

          // Fiber offers
          const fiberOffers = fiber.offers.filter(
            (offer) => offer.eligibility.eligible === true,
          );
          if (fiberOffers.length > 0) {
            this.fiber.offers = fiberOffers;
            this.isFiberOffers = true;
          } else {
            this.isFiberOffers = false;
          }
        }

        return elig;
      })
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  /**
   * Launch eligibility by address
   * - retrieve buildings eligibility by address first
   * - if buildings found, test fiber eligibility
   * - if fiber offers available, skip copper test
   * - if no fiber offers, fallback to copper eligibility
   * - if no buildings found, fallback to copper eligibility only
   */
  submitAddress() {
    this.displayResult = false;
    this.availableLines = null;
    this.buildings = null;
    this.loading = true;
    this.fiber = null;

    this.offersChange({
      OFFERS: [],
    });

    this.searchBuildings()
      .then((buildings) => {
        if (buildings?.length) {
          if (buildings.length === 1) {
            // Single building: test fiber eligibility directly
            const [building] = buildings;
            return this.testFiberEligibility(building.reference).then(() => {
              return this.handleEligibilityResult(building);
            });
          }
          // Multiple buildings: display list, don't test eligibility yet
          this.buildings = buildings;
          this.displayListOfBuildings = true;
          this.loading = false;
          this.displaySearch = false;
          this.displayResult = true;
          this.displaySearchResult = true;
          return Promise.resolve();
        }
        // No buildings found: fallback to copper eligibility only
        return this.copperEligibilityByAddress().then((copper) => {
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
        });
      })
      .catch((error) => {
        this.displayResult = false;
        this.displaySearchResult = false;
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  /**
   * Create the offer response which is sent to the move-eligibility controller
   * @param { Object } copper copper eligibility result
   * @param { Object } fiber fiber eligibility result
   * @param { Object } eligType type of eligibility: 'address' | 'number'
   * @param { Object } status status of the line: 'active' | 'inactive' | 'create'
   * @param { Object } building building eligibility result
   */
  sendLineOffers(copper, fiber, eligType, status, building) {
    const copperOffers = copper?.result
      ? copper.result.offers.filter(
          (offer) => offer.eligibility.eligible === true,
        )
      : null;
    const offer = {
      eligType,
      status,
      eligibilityReference: copper?.result
        ? copper.result.eligibilityReference
        : null,
      offers: copperOffers,
      endpoint: {
        copperInfo: copper?.result ? copper.result.endpoint.copperInfo : null,
        portability: copper?.result ? copper.result.endpoint.portability : null,
        reference: copper?.result ? copper.result.endpoint.reference : null,
        referenceType: copper?.result
          ? copper.result.endpoint.referenceType
          : null,
      },
      searchAddress: this.address,
      building,
    };
    if (fiber) {
      if (copper?.result?.endpoint?.address !== fiber.addressFiber) {
        offer.endpoint.neighbourAddress =
          copper?.result?.endpoint?.address || null;
      }
      offer.eligibilityReferenceFiber = fiber.eligibilityReferenceFiber;
      offer.fiberInfo = fiber.fiberInfo;
      offer.referenceFiber = fiber.referenceFiber;
      offer.referenceTypeFiber = fiber.referenceTypeFiber;
      offer.addressFiber = fiber.addressFiber;
      offer.offers = fiber.offers;
      offer.endpoint.address = fiber.addressFiber;
      offer.buildingReference =
        fiber.referenceTypeFiber === BUILDING
          ? fiber.referenceFiber
          : fiber.fiberInfo.buildingReference;
    } else {
      offer.eligibilityReference = copper?.result?.eligibilityReference;
      offer.endpoint.address = copper?.result?.endpoint?.address;
      offer.offers = copperOffers;
    }

    this.offersChange({
      OFFERS: [offer],
    });
  }
}
