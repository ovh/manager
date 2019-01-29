angular.module('managerApp').component('packMoveEligibilityAddress', {
  bindings: {
    address: '=?',
    offersChange: '&',
    submited: '&',
    method: '=?',
  },
  templateUrl: 'app/telecom/pack/move/eligibility/address/pack-move-eligibility-address.html',
  controllerAs: 'PackMoveEligibilityAddress',
  controller(
    $q, $scope, $stateParams, $translate, $filter,
    OvhApiXdslEligibility, OvhApiPackXdslMove, TucToast, tucValidator, costs,
  ) {
    const self = this;
    this.validator = tucValidator;
    this.loaders = {};
    this.streets = [];

    /**
     * Get city list from a zip code
     * @param {String} zipcode Zip code
     * */
    this.getCities = function (zipcode) {
      self.cities = null;
      delete this.address.streetNumber;
      delete this.address.street;
      if (this.validator.tucIsZipcode(zipcode, ['metropolitanFrance'])) {
        self.loaders.cities = true;
        self.loading = true;
        OvhApiXdslEligibility.v6().getCities({
          zipCode: zipcode,
        }).$promise.then((cities) => {
          self.cities = cities;
          if (self.cities.length === 1) {
            self.address.city = _.first(self.cities);
          }
        }, (error) => {
          TucToast.error($translate.instant('pack_move_eligibility_zipcode_error', { zipcode }));
          return $q.reject(error);
        }).finally(() => {
          delete self.loaders.cities;
          self.loading = false;
        });
      }
    };

    /**
     * Propose streets from partial street name
     * @param {String} partial Part of the name of the street
     * */
    this.getStreets = function (partial) {
      self.streets = [];
      const partialStreet = partial.replace(/^[\d\s,]*/, '');
      if (partialStreet.length > 2) {
        self.loaders.streets = true;
        self.loading = true;
        return OvhApiXdslEligibility.v6().getStreets({
          inseeCode: self.address.city.inseeCode,
          partialName: partialStreet,
        }).$promise.then(
          (streets) => {
            self.streets = streets;
            return streets;
          },
          (error) => {
            TucToast.error($translate.instant('pack_move_eligibility_street_error', { partial }));
            return $q.reject(error);
          },
        ).finally(() => {
          delete self.loaders.streets;
          self.loading = false;
        });
      }
      return self.streets;
    };

    /**
     * Check that the street name match with a street object
     * @param {String} streetName Name of the street
     * @returns {boolean}
     */
    this.checkSelectedStreets = function (street) {
      return street && !!_.find(self.streets, { name: street.name });
    };

    this.submitAddress = function () {
      this.loading = true;
      self.submited();

      return OvhApiPackXdslMove.v6().pollElligibility($scope, {
        packName: $stateParams.packName,
        address: self.address,
      }).then(
        (data) => {
          if (data.error) {
            self.offersChange({ OFFERS: [] });
            TucToast.error($translate.instant(`pack_move_eligibility_address_error${data.error.indexOf('error_looking_for_neighbour_number') > -1 ? '_neighbour' : '_pairs'}`));
            return $q.reject(data.error);
          }
          if (data.result.offers.length) {
            _.extend(self.testLine, data);
            self.offers = _.isArray(data.result.offers) ? data.result.offers : [];
            self.offers.forEach((offer) => {
              _.set(offer, 'installationPrice', costs.packMove.lineCreation);
              if (offer.meetingSlots) {
                _.set(offer, 'meetingSlots.calendarData', [offer.meetingSlots.meetingSlots.map(slot => ({
                  tooltip: [$filter('date')(slot.startDate, 'HH:mm'), $filter('date')(slot.endDate, 'HH:mm')].join(' - '),
                  title: '',
                  start: slot.startDate,
                  end: slot.endDate,
                  data: slot,
                }))]);
                _.set(offer, 'meetingSlots.firstSlot', _.first(_.sortBy(offer.meetingSlots.meetingSlots, ['startDate'])));
              }
            });
          }
          self.offersChange({ OFFERS: self.offers });
          return data;
        },
        (err) => {
          TucToast.error(err);
          return $q.reject(err);
        },
      ).finally(() => {
        self.loading = false;
      });
    };
  },
});
