import compact from 'lodash/compact';
import assignIn from 'lodash/assignIn';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import pick from 'lodash/pick';
import union from 'lodash/union';
import uniqueId from 'lodash/uniqueId';
import template from './template.html';

export default /* @ngInject */ (
  $translate,
  MONDIAL_RELAY,
  MONDIAL_RELAY_PICS,
) => {
  /**
   * Build the bound box to recenter the map. The box is growing to include all points
   * @param   {Bounds} bounds Bounding box
   * @param   {Object} point  Point {lat, lng}
   * @param {boolean=} first  Must be true for the first point (this will initialize the bound box)
   */
  const appendBound = (bounds, point, first) => {
    const resultBound = { ...bounds };
    const margin = 0.01;

    resultBound.northEast.lat = first || point.lat + margin > bounds.northEast.lat
      ? point.lat + margin : bounds.northEast.lat;
    resultBound.southWest.lat = first || point.lat - margin < bounds.southWest.lat
      ? point.lat - margin : bounds.southWest.lat;
    resultBound.northEast.lng = first || point.lng + margin > bounds.northEast.lng
      ? point.lng + margin : bounds.northEast.lng;
    resultBound.southWest.lng = first || point.lng - margin < bounds.southWest.lng
      ? point.lng - margin : bounds.southWest.lng;

    return resultBound;
  };

  /**
   * Convert marker index in marker name
   * @param {Number} index Index of the marker [0..25]
   * @returns {String}
   */
  const getMarkerName = index => String.fromCharCode(65 + index);

  /**
   * Generate the icon object for the marker
   * @param index
   * @returns {{
   *    iconUrl: string,
   *    shadowUrl: string,
   *    iconSize: number[],
   *    shadowSize: number[],
   *    iconAnchor: number[],
   *    shadowAnchor: number[],
   *    popupAnchor: *[],
   * }}
   */
  const getMarkerIcon = index => assignIn(
    {
      iconUrl: MONDIAL_RELAY_PICS[`gmaps_pr02${getMarkerName(index)}`],
      shadowUrl: MONDIAL_RELAY_PICS.gmaps_pr_shadow,
    },
    pick(MONDIAL_RELAY, ['iconSize', 'shadowSize', 'iconAnchor', 'shadowAnchor', 'popupAnchor']),
  );

  /**
   * Reformat the opening hours of the relays
   * @param {Object} opening Structure describing opening times {
   *    monday: [{
   *      start: "0800",
   *      end:"1900"
   *    }
   * ]}
   * @returns {Array} List of open days [{days: ["monday", "tuesday"], hours: ["08:00-19:00"]}]
   */
  const reformatOpening = (opening) => {
    const reformatTime = openingTime => `${openingTime.substring(0, 2)}:${openingTime.substring(2, 4)}`;
    const getAllOpenings = openingTimes => map(openingTimes, openingTime => [
      reformatTime(openingTime.start),
      reformatTime(openingTime.end),
    ].join('—'));

    const result = MONDIAL_RELAY.weekDays.map(weekDay => ({
      days: [weekDay],
      hours: getAllOpenings(opening[weekDay]),
    }));
    return result.map((relayDay, i) => {
      let index = 1;

      const resultRelayDay = { ...relayDay };

      // relayDay without hours parameter === closed (yet kept in array)
      if (!relayDay.hours) {
        return relayDay;
      }

      // In order to group following opening days with equal time windows
      // We loop until time windows are different (or at the end of the array)
      while (i + index < result.length && isEqual(relayDay.hours, result[i + index].hours)) {
        resultRelayDay.days = union(relayDay.days, result[i + index].days);

        // Also we remove duplicate line
        delete result[i + index];
        index += 1;
      }

      // Then we build regarding the nature of each relayDay
      // (single time windows, grouped ones or closed)
      if (relayDay.days.length > 1) {
        resultRelayDay.days = `${$translate.instant(`components_mondial_relay_${relayDay.days[0]}`)}. ${
          $translate.instant('components_mondial_relay_hours_to')} ${
          $translate.instant(`components_mondial_relay_${relayDay.days[relayDay.days.length - 1]}`).toLowerCase()}.`;
      } else if (relayDay.days.length) {
        resultRelayDay.days = $translate.instant(`components_mondial_relay_${relayDay.days[0]}_long`);
      }
      return resultRelayDay;
    });
  };

  return {
    restrict: 'AE',
    bindToController: true,
    scope: {
      ngModel: '=?',
      userService: '=?',
      mondialRelayService: '=?',
    },
    template,
    controllerAs: '$ctrl',
    controller(
      $http,
      $injector,
      $q,
      $scope,
      $timeout,
      leafletBoundsHelpers,
      leafletData,
      leafletEvents,
    ) {
      const self = this;

      this.loading = {
        init: true,
        search: false,
      };

      this.mapId = uniqueId('mondial-relay');

      /**
       * Render the results into the map and list
       * @param {Object} data API response
       */
      this.getResult = (data) => {
        if (data && data.relayPoints) {
          this.foundRelays = map(data.relayPoints, (relay, index) => ({
            ...relay,
            opening: reformatOpening(relay.opening),
            marker: getMarkerName(index),
          }));
          this.referenceAddress = data.referenceAddress;
          this.map.markers = map(this.foundRelays, (relay, index) => {
            self.map.bounds = appendBound(self.map.bounds, relay, !index);
            return {
              lat: relay.lat,
              lng: relay.lng,
              message: `${Math.round(relay.distance / 100) / 10} km`,
              icon: getMarkerIcon(index),
              opacity: 0.7,
              focus: false,
              index,
            };
          });
          this.setMarkerListeners();
        } else {
          this.message = $translate.instant('components_mondial_relay_not_available');
        }
      };

      /**
       * Register the listener on all the markers
       */
      this.setMarkerListeners = () => {
        // kills the old broadcasters
        forEach(this.broadcasters, (broadcaster) => {
          broadcaster();
        });

        // settle the new broacasters
        this.broadcasters = map(
          leafletEvents.getAvailableMarkerEvents(),
          markerEvent => $scope.$on(`leafletDirectiveMarker.${markerEvent}`, (event, args) => {
            switch (event.name) {
              case 'leafletDirectiveMarker.mouseover':
                self.markerHover(args.model.index);
                break;
              case 'leafletDirectiveMarker.mouseout':
                self.markerHover();
                break;
              case 'leafletDirectiveMarker.click':
                self.foundRelays[args.model.index] = self.select(
                  self.foundRelays[args.model.index],
                );
                break;
              default:
                break;
            }
          }),
        );
      };

      /**
       * Action to perform when the mouse is over the marker
       * @param {int} relayIndex index of the relay
       */
      this.markerHover = (relayIndex) => {
        this.foundRelays = map(this.foundRelays, (relay, index) => {
          const { markerHover, ...resultRelay } = relay;
          let opacity = index !== relayIndex ? 0.7 : 1;
          if (self.map.markers[index].selected) {
            opacity = 1;
          }
          self.map.markers[index].opacity = opacity;
          return resultRelay;
        });


        if (!isUndefined(relayIndex)) {
          this.foundRelays[relayIndex].markerHover = true;
          this.map.markers[relayIndex].opacity = 1;
        }
      };

      /**
       * Perform a search
       * @return {Promise}
       */
      this.search = (filter) => {
        this.message = null;
        this.referenceAddress = '';
        this.loading.search = true;
        this.ngModel = null;
        this.foundRelays = [];
        let parsedFilter = filter;

        if (!parsedFilter) {
          parsedFilter = this.filter;
          const searchQuery = get(parsedFilter, 'searchQuery', '');
          if (searchQuery) {
            const zipcode = compact(searchQuery.match(/\d{5}/g));
            if (zipcode.length) {
              parsedFilter.zipcode = head(zipcode).trim();
            } else {
              const city = compact(searchQuery.match(/^[A-z\u00C0-\u024F][A-z\u00C0-\u024F'\s-]*[A-z\u00C0-\u024F]$/g));
              if (city.length) {
                parsedFilter.city = head(city).trim();
              }
            }
            delete parsedFilter.searchQuery;
          }
        }

        return this.mondialRelayService.v6().search(
          parsedFilter,
          $scope,
        )
          .then((resp) => {
            self.userSearch = true;
            return self.getResult(resp);
          })
          .catch((err) => {
            self.message = $translate.instant('components_mondial_relay_not_found');
            return $q.reject(err);
          })
          .finally(() => {
            self.loading.search = false;
          });
      };

      /**
       * Action to perform whan a relay is selected
       * @param relay
       */
      this.select = (relay) => {
        const selectedRelay = { ...relay };
        const relayIndex = this.foundRelays.indexOf(selectedRelay);

        this.foundRelays = map(this.foundRelays, (foundRelay) => {
          const { selected, ...resultRelay } = foundRelay;
          return resultRelay;
        });

        this.map.markers = map(this.map.markers, (marker, index) => ({
          ...marker,
          focus: false,
          opacity: relayIndex !== index ? 0.7 : 1,
          selected: (relayIndex === index),
        }));

        selectedRelay.selected = true;
        this.ngModel = selectedRelay;

        return selectedRelay;
      };

      /**
       * Initialize a search to user location
       * @return {Promise}
       */
      this.gotoUserLoc = () => {
        this.userService.v6().get().$promise.then((me) => {
          if (!self.userSearch) {
            const filter = {
              country: me.country.toLowerCase() || MONDIAL_RELAY.defaultCountry,
            };

            // metropolitan france only
            if (MONDIAL_RELAY.metroFrZipValidator.test(me.zip)) {
              filter.zipcode = me.zip;
            } else if (me.city) {
              filter.city = me.city;
            }
            return self.search(filter);
          }
          return me;
        }).catch(err => $http.get(MONDIAL_RELAY.ipLocUrl).then((geoloc) => {
          if (MONDIAL_RELAY.metroFrZipValidator.test(geoloc.data.zip_code)
            && geoloc.data.country_code) {
            return self.search({
              country: geoloc.data.country_code.toLowerCase(),
              zipcode: geoloc.data.zip_code,
            });
          }
          if (geoloc.data.city && geoloc.data.country_code) {
            return self.search({
              country: geoloc.data.country_code.toLowerCase(),
              city: geoloc.data.city,
            });
          }
          self.map.center = {
            lat: geoloc.data.latitude,
            lng: geoloc.data.longitude,
            zoom: 5,
          };
          return $q.reject(err);
        }));
      };

      /*= =====================================
      =            INITIALIZATION            =
      ====================================== */

      this.init = () => {
        this.userService = this.userService || $injector.get('OvhApiMe');
        this.mondialRelayService = this.mondialRelayService || $injector.get('OvhApiSupplyMondialRelay');

        this.map = {
          focus: MONDIAL_RELAY.initialLocation,
          center: {},
          markers: [],
          bounds: leafletBoundsHelpers.createBoundsFromArray(MONDIAL_RELAY.initialBoundingBox),
          events: {
            markers: {
              enable: leafletEvents.getAvailableMarkerEvents(),
            },
          },
        };

        this.broadcasters = [];
        this.foundRelays = [];
        this.ngModel = null;
        this.filter = {
          country: MONDIAL_RELAY.defaultCountry,
        };

        // workaround to fix display bug on the map
        leafletData.getMap(self.mapId).then((leafletMap) => {
          self.leafletMap = leafletMap;
          $timeout(() => {
            leafletMap.invalidateSize();
            leafletMap.fitBounds(MONDIAL_RELAY.initialBoundingBox);
          });
        });

        self.loading.init = false;
        return self.gotoUserLoc();
      };

      this.init();
    },
  };
};
