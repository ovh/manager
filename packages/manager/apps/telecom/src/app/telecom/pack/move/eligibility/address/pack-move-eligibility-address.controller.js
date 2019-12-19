import assignIn from 'lodash/assignIn';
import head from 'lodash/head';
import isArray from 'lodash/isArray';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';

import { AUTHORIZED_ABBREVIATIONS } from './pack-move-eligibility-address.constants';

export default class {
  /* @ngInject */
  constructor(
    $filter, $q, $scope, $stateParams, $translate,
    OvhApiXdslEligibility, OvhApiPackXdslMove, TucToast, tucValidator, costs,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiXdslEligibility = OvhApiXdslEligibility;
    this.OvhApiPackXdslMove = OvhApiPackXdslMove;
    this.TucToast = TucToast;
    this.validator = tucValidator;
    this.costs = costs;
  }

  $onInit() {
    this.loaders = {};
    this.streets = [];
  }

  /**
   * Get city list from a zip code
   * @param {String} zipcode Zip code
   * */
  getCities(zipCode) {
    this.cities = null;
    this.address.city = null;
    this.address.streetNumber = null;
    this.address.street = null;
    if (this.validator.tucIsZipcode(zipCode, ['metropolitanFrance'])) {
      this.loaders.cities = true;
      this.loading = true;
      return this.OvhApiXdslEligibility.v6().getCities({
        zipCode,
      }).$promise.then((cities) => {
        this.cities = cities;
        if (this.cities.length === 1) {
          [this.address.city] = this.cities;
        }
      }).catch((error) => {
        this.TucToast.error(this.$translate.instant('pack_move_eligibility_zipcode_error', { zipCode }));
        return this.$q.reject(error);
      }).finally(() => {
        delete this.loaders.cities;
        this.loading = false;
      });
    }

    return null;
  }

  /**
   * Propose streets from selected city
   * @param {String} partial Part of the name of the street
   * */
  getStreets(partial) {
    this.streets = [];
    const partialStreet = partial.replace(/^[\d\s,]*/, '');
    if (partialStreet.length > 2 || AUTHORIZED_ABBREVIATIONS.includes(partialStreet)) {
      this.loaders.streets = true;
      this.loading = true;
      return this.OvhApiXdslEligibility.v6().getStreets({
        inseeCode: this.address.city.inseeCode,
        partialName: partialStreet,
      }).$promise
        .then((streets) => {
          this.streets = streets;
          return streets;
        }).catch((error) => {
          this.TucToast.error(this.$translate.instant('pack_move_eligibility_street_error', { city: this.address.city }));
          return this.$q.reject(error);
        }).finally(() => {
          delete this.loaders.streets;
          this.loading = false;
        });
    }

    return this.streets;
  }

  /**
   * Check that the street name match with a street object
   * @param {String} streetName Name of the street
   * @returns {boolean}
   */
  checkSelectedStreets(street) {
    return street && this.streets.some(({ name }) => name === street.name);
  }

  submitAddress() {
    this.loading = true;
    this.submited();

    return this.OvhApiPackXdslMove.v6().pollElligibility(this.$scope, {
      packName: this.$stateParams.packName,
      address: this.address,
    })
      .then((data) => {
        if (data.error) {
          this.offersChange({ OFFERS: [] });
          this.TucToast.error(this.$translate.instant(`pack_move_eligibility_address_error${data.error.includes('error_looking_for_neighbour_number') ? '_neighbour' : '_pairs'}`));
          return this.$q.reject(data.error);
        }
        if (data.result.offers.length) {
          assignIn(this.testLine, data);
          this.offers = isArray(data.result.offers) ? data.result.offers : [];
          this.offers.forEach((offer) => {
            set(offer, 'installationPrice', this.costs.packMove.lineCreation);
            if (offer.meetingSlots) {
              set(offer, 'meetingSlots.calendarData', [offer.meetingSlots.meetingSlots.map((slot) => ({
                tooltip: `${this.$filter('date')(slot.startDate, 'HH:mm')} - ${this.$filter('date')(slot.endDate, 'HH:mm')}`,
                title: '',
                start: slot.startDate,
                end: slot.endDate,
                data: slot,
              }))]);
              set(offer, 'meetingSlots.firstSlot', head(sortBy(offer.meetingSlots.meetingSlots, ['startDate'])));
            }
          });
        }
        this.offersChange({ OFFERS: this.offers });
        return data;
      })
      .catch((err) => {
        this.TucToast.error(err);
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
