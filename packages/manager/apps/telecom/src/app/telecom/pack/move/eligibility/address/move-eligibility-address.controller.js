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
   * Test address for copper eligibility
   * @returns Promise
   */
  testAddress() {
    if (this.isReseller) {
      // If current offer is a reseller offer,
      // launch eligibility test address for partners (reseller)
      return this.OvhApiConnectivityEligibility.v6().testAddressPartners(
        this.$scope,
        {
          streetCode: this.address.street.streetCode,
          streetNumber: this.address.streetNumber,
        },
      );
    }
    return this.OvhApiConnectivityEligibility.v6().testAddress(this.$scope, {
      streetCode: this.address.street.streetCode,
      streetNumber: this.address.streetNumber,
    });
  }

  /**
   * Copper eligibility by address
   */
  copperEligibilityByAddress() {
    return this.testAddress()
      .then(({ result }) => ({ result }))
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  /**
   * Retrieve buildings for the address
   */
  searchBuildings() {
    return this.OvhApiConnectivityEligibilitySearch.v6()
      .searchBuildings(this.$scope, {
        streetCode: this.address.street.streetCode,
        streetNumber: this.address.streetNumber,
      })
      .then((data) => {
        return data.result.length > 0 ? data.result : null;
      })
      .catch((error) => {
        this.loading = false;
        this.TucToast.error(error);
      });
  }

  /**
   * Select building from the list
   * @param {*} building
   */
  testBuilding(building) {
    return this.testFiberEligibility(building.reference).then(() => {
      this.displayListOfBuildings = false;

      this.sendLineOffers(
        this.copper,
        this.fiber,
        'address',
        ELIGIBILITY_LINE_STATUS.create,
        building,
      );
      this.displayResult = true;
      this.displaySearchResult = true;
      this.displaySearch = false;
      this.loading = false;
    });
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
   * - retrieve fiber eligibility by address
   * - retrieve copper eligibility by address which can return lines associated to the address or nothing
   * - if no line, retrieve the copper eligibility by address and send offers to create new line to this address
   * - if lines, display them to the user
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

    this.copperEligibilityByAddress().then((copper) => {
      this.searchBuildings().then((buildings) => {
        if (buildings) {
          if (buildings.length === 1) {
            // Eligibility fiber
            const [building] = buildings;
            this.testFiberEligibility(building.reference).then(() => {
              // send line offers
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
            });
          } else {
            // Display buildings list
            this.buildings = buildings;

            this.copper = copper;
            this.displayListOfBuildings = true;
            this.loading = false;
            this.displaySearch = false;
            this.displayResult = true;
            this.displaySearchResult = true;
          }
        } else {
          // send line offers
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

  /**
   * Create the offer response which is sent to the move-eligilibility controller
   * @param { Object } copper copper eligibility result
   * @param { Object } fiber fiber eligibility result
   * @param { Object } eligType type of eligibility: 'address' | 'number'
   * @param { Object } status status of the line: 'active' | 'inactive' | 'create'
   * @param { Object } building building eligibility result
   */
  sendLineOffers(copper, fiber, eligType, status, building) {
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
      searchAddress: this.address,
      building,
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
}
