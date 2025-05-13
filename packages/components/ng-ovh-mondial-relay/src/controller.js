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

import {
  PICTURES as MONDIAL_RELAY_PICS,
  MONDIAL_RELAY,
  MONDIAL_RELAY_ELEMENT,
} from './constants';

export default class {
  /* @ngInject */
  constructor(
    $http,
    $injector,
    $q,
    $scope,
    $timeout,
    $translate,
    leafletBoundsHelpers,
    leafletData,
    leafletEvents,
  ) {
    this.$http = $http;
    this.$injector = $injector;
    this.$q = $q;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.leafletBoundsHelpers = leafletBoundsHelpers;
    this.leafletData = leafletData;
    this.leafletEvents = leafletEvents;
  }

  $onInit() {
    this.loading = {
      init: true,
      search: false,
    };

    this.mapId = uniqueId(MONDIAL_RELAY_ELEMENT);
    this.userService = this.userService || this.$injector.get('OvhApiMe');
    this.mondialRelayService =
      this.mondialRelayService ||
      this.$injector.get('OvhApiSupplyMondialRelay');

    this.map = {
      focus: MONDIAL_RELAY.initialLocation,
      center: {},
      markers: [],
      bounds: this.leafletBoundsHelpers.createBoundsFromArray(
        MONDIAL_RELAY.initialBoundingBox,
      ),
      events: {
        markers: {
          enable: this.leafletEvents.getAvailableMarkerEvents(),
        },
      },
    };

    this.broadcasters = [];
    this.foundRelays = [];
    this.ngModel = null;
    this.filter = {
      country: MONDIAL_RELAY.defaultCountry,
    };

    this.loading.init = false;
    return this.$q.all([
      // workaround to fix display bug on the map
      this.leafletData.getMap(this.mapId).then((leafletMap) => {
        this.leafletMap = leafletMap;
        this.$timeout(() => {
          leafletMap.invalidateSize();
          leafletMap.fitBounds(MONDIAL_RELAY.initialBoundingBox);
        });
      }),

      this.gotoUserLoc(),
    ]);
  }

  /**
   * Generate the icon object for the marker
   * @param index
   * @returns {Object}
   */
  getMarkerIcon(index) {
    return assignIn(
      {
        iconUrl:
          MONDIAL_RELAY_PICS[
            `gmaps_pr02${this.constructor.getMarkerName(index)}`
          ],
        shadowUrl: MONDIAL_RELAY_PICS.gmaps_pr_shadow,
      },
      pick(MONDIAL_RELAY, [
        'iconSize',
        'shadowSize',
        'iconAnchor',
        'shadowAnchor',
        'popupAnchor',
      ]),
    );
  }

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
  reformatOpening(opening) {
    const reformatTime = (openingTime) =>
      `${openingTime.substring(0, 2)}:${openingTime.substring(2, 4)}`;
    const getAllOpenings = (openingTimes) =>
      map(openingTimes, (openingTime) =>
        [reformatTime(openingTime.start), reformatTime(openingTime.end)].join(
          '—',
        ),
      );

    const result = MONDIAL_RELAY.weekDays.map((weekDay) => ({
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
      while (
        i + index < result.length &&
        isEqual(relayDay.hours, result[i + index].hours)
      ) {
        resultRelayDay.days = union(relayDay.days, result[i + index].days);

        // Also we remove duplicate line
        delete result[i + index];
        index += 1;
      }

      // Then we build regarding the nature of each relayDay
      // (single time windows, grouped ones or closed)
      if (relayDay.days.length > 1) {
        resultRelayDay.days = `${this.$translate.instant(
          `components_mondial_relay_${relayDay.days[0]}`,
        )}. ${this.$translate.instant(
          'components_mondial_relay_hours_to',
        )} ${this.$translate
          .instant(
            `components_mondial_relay_${
              relayDay.days[relayDay.days.length - 1]
            }`,
          )
          .toLowerCase()}.`;
      } else if (relayDay.days.length) {
        resultRelayDay.days = this.$translate.instant(
          `components_mondial_relay_${relayDay.days[0]}_long`,
        );
      }
      return resultRelayDay;
    });
  }

  /**
   * Render the results into the map and list
   * @param {Object} data API response
   */
  getResult(data) {
    if (data && data.relayPoints) {
      this.foundRelays = map(data.relayPoints, (relay, index) => ({
        ...relay,
        opening: this.reformatOpening(relay.opening),
        marker: this.constructor.getMarkerName(index),
      }));
      this.referenceAddress = data.referenceAddress;
      this.map.markers = map(this.foundRelays, (relay, index) => {
        this.map.bounds = this.constructor.appendBound(
          this.map.bounds,
          relay,
          !index,
        );
        return {
          lat: relay.lat,
          lng: relay.lng,
          message: `${Math.round(relay.distance / 100) / 10} km`,
          icon: this.getMarkerIcon(index),
          opacity: 0.7,
          focus: false,
          index,
        };
      });
      this.setMarkerListeners();
    } else {
      this.message = this.$translate.instant(
        'components_mondial_relay_not_available',
      );
    }
  }

  /**
   * Register the listener on all the markers
   */
  setMarkerListeners() {
    // kills the old broadcasters
    forEach(this.broadcasters, (broadcaster) => {
      broadcaster();
    });

    // settle the new broacasters
    this.broadcasters = map(
      this.leafletEvents.getAvailableMarkerEvents(),
      (markerEvent) =>
        this.$scope.$on(
          `leafletDirectiveMarker.${markerEvent}`,
          (event, args) => {
            switch (event.name) {
              case 'leafletDirectiveMarker.mouseover':
                this.markerHover(args.model.index);
                break;
              case 'leafletDirectiveMarker.mouseout':
                this.markerHover();
                break;
              case 'leafletDirectiveMarker.click':
                this.foundRelays[args.model.index] = this.select(
                  this.foundRelays[args.model.index],
                );
                break;
              default:
                break;
            }
          },
        ),
    );
  }

  /**
   * Action to perform when the mouse is over the marker
   * @param {int} relayIndex index of the relay
   */
  markerHover(relayIndex) {
    this.foundRelays = map(this.foundRelays, (relay, index) => {
      const { markerHover, ...resultRelay } = relay;
      let opacity = index !== relayIndex ? 0.7 : 1;
      if (this.map.markers[index].selected) {
        opacity = 1;
      }
      this.map.markers[index].opacity = opacity;
      return resultRelay;
    });

    if (!isUndefined(relayIndex)) {
      this.foundRelays[relayIndex].markerHover = true;
      this.map.markers[relayIndex].opacity = 1;
    }
  }

  /**
   * Perform a search
   * @return {Promise}
   */
  search(filter) {
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
          const city = compact(
            searchQuery.match(
              /^[A-z\u00C0-\u024F][A-z\u00C0-\u024F'\s-]*[A-z\u00C0-\u024F]$/g,
            ),
          );
          if (city.length) {
            parsedFilter.city = head(city).trim();
          }
        }
        delete parsedFilter.searchQuery;
      }
    }

    return this.mondialRelayService
      .v6()
      .search(parsedFilter, this.$scope)
      .then((resp) => {
        this.userSearch = true;
        return this.getResult(resp);
      })
      .catch((err) => {
        this.message = this.$translate.instant(
          'components_mondial_relay_not_found',
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loading.search = false;
      });
  }

  /**
   * Action to perform whan a relay is selected
   * @param relay
   */
  select(relay) {
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
      selected: relayIndex === index,
    }));

    selectedRelay.selected = true;
    this.ngModel = selectedRelay;

    return selectedRelay;
  }

  /**
   * Initialize a search to user location
   * @return {Promise}
   */
  gotoUserLoc() {
    return this.userService
      .v6()
      .get()
      .$promise.then((me) => {
        if (!this.userSearch) {
          const filter = {
            country: me.country.toLowerCase() || MONDIAL_RELAY.defaultCountry,
          };

          // metropolitan france only
          if (MONDIAL_RELAY.metroFrZipValidator.test(me.zip)) {
            filter.zipcode = me.zip;
          } else if (me.city) {
            filter.city = me.city;
          }
          return this.search(filter);
        }
        return me;
      })
      .catch((err) =>
        this.$http.get(MONDIAL_RELAY.ipLocUrl).then((geoloc) => {
          if (
            MONDIAL_RELAY.metroFrZipValidator.test(geoloc.data.zip_code) &&
            geoloc.data.country_code
          ) {
            return this.search({
              country: geoloc.data.country_code.toLowerCase(),
              zipcode: geoloc.data.zip_code,
            });
          }
          if (geoloc.data.city && geoloc.data.country_code) {
            return this.search({
              country: geoloc.data.country_code.toLowerCase(),
              city: geoloc.data.city,
            });
          }
          this.map.center = {
            lat: geoloc.data.latitude,
            lng: geoloc.data.longitude,
            zoom: 5,
          };
          return this.$q.reject(err);
        }),
      );
  }

  /**
   * Build the bound box to recenter the map. The box is growing to include all points
   * @param {Bounds} bounds Bounding box
   * @param {Object} point  Point {lat, lng}
   * @param {Boolean} first  Must be true for the first point (this will initialize the bound box)
   */
  static appendBound(bounds, point, first) {
    const resultBound = { ...bounds };
    const margin = 0.01;

    resultBound.northEast.lat =
      first || point.lat + margin > bounds.northEast.lat
        ? point.lat + margin
        : bounds.northEast.lat;
    resultBound.southWest.lat =
      first || point.lat - margin < bounds.southWest.lat
        ? point.lat - margin
        : bounds.southWest.lat;
    resultBound.northEast.lng =
      first || point.lng + margin > bounds.northEast.lng
        ? point.lng + margin
        : bounds.northEast.lng;
    resultBound.southWest.lng =
      first || point.lng - margin < bounds.southWest.lng
        ? point.lng - margin
        : bounds.southWest.lng;

    return resultBound;
  }

  /**
   * Convert marker index in marker name
   * @param {Number} index Index of the marker [0..25]
   * @returns {String}
   */
  static getMarkerName(index) {
    return String.fromCharCode(65 + index);
  }
}
