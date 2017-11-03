angular.module("ovh-angular-mondial-relay", ["ovh-angular-mondial-relay-images", "pascalprecht.translate", "leaflet-directive"]);

angular.module("ovh-angular-mondial-relay").constant("MONDIAL_RELAY", {
    weekDays: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ],
    iconSize: [30, 36], // size of the icon
    shadowSize: [41, 26], // size of the shadow
    iconAnchor: [15, 36], // point of the icon which will correspond to marker's location
    shadowAnchor: [6, 22], // the same for the shadow
    popupAnchor: [-3, -36], // point from which the popup should open relative to the iconAnchor,
    initialBoundingBox: [
        [51.201, -4.056],
        [42.466, 7.923]
    ],
    initialLocation: {
        lat: 45.8556,
        lng: 2.3466,
        zoom: 5
    },
    defaultCountry: "fr",
    ipLocUrl: "https://freegeoip.net/json/",
    metroFrZipValidator: /^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/
});

/**
 * @ngdoc directive
 * @name ovh-angular-mondial-relay.directive:mondialRelay
 * @scope
 * @restrict EA
 * @description
 * <p>Display Modial relay map for relay selection</p>
 * @example
   <example module="Module">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <mondial-relay data-ng-model="selectedRelay">
            </mondial-relay>
            <pre data-ng-bind="display(selectedRelay)"></pre>
        </div>
   </file>
   <file name="script.js">
        angular.module("Module", []);
        angular.module("Module").controller("mainCtrl", function() {
            $scope.display = function (obj) {
                return obj ? JSON.stringify(obj) : "";
            };
        });
   </file>
   </example>
 * @param {string} ng-model Variable that will recieve the selected relay.
 * @param {string} [user-service='User'] The name of your user service, in case your service name is different from the default.
 */
angular.module("ovh-angular-mondial-relay")
    .directive("mondialRelay", ["MONDIAL_RELAY_PICS", "MONDIAL_RELAY", function (MONDIAL_RELAY_PICS, MONDIAL_RELAY) {
        "use strict";

        /**
         * Build the bound box to recenter the map. The box is growing to include all points
         * @param   {Bounds} bounds Bounding box
         * @param   {Object} point  Point {lat, lng}
         * @param {boolean=} first  Must be true for the first point (this will initialize the bound box)
         */
        var appendBound = function appendBound (bounds, point, first) {
            var margin = 0.01;
            bounds.northEast.lat = first || point.lat + margin > bounds.northEast.lat ? bounds.northEast.lat = point.lat + margin : bounds.northEast.lat;
            bounds.southWest.lat = first || point.lat - margin < bounds.southWest.lat ? bounds.southWest.lat = point.lat - margin : bounds.southWest.lat;
            bounds.northEast.lng = first || point.lng + margin > bounds.northEast.lng ? bounds.northEast.lng = point.lng + margin : bounds.northEast.lng;
            bounds.southWest.lng = first || point.lng - margin < bounds.southWest.lng ? bounds.southWest.lng = point.lng - margin : bounds.southWest.lng;
            return bounds;
        };

        /**
         * Convert marker index in marker name
         * @param {Number} index Index of the marker [0..25]
         * @returns {String}
         */
        var getMarkerName = function getMarkerName (index) {
            return String.fromCharCode(65 + index);
        };

        /**
         * Generate the icon object for the marker
         * @param index
         * @returns {{iconUrl: string, shadowUrl: string, iconSize: number[], shadowSize: number[], iconAnchor: number[], shadowAnchor: number[], popupAnchor: *[]}}
         */
        var getMarkerIcon = function getMarkerIcon (index) {
            return _.extend(
                {
                    iconUrl: MONDIAL_RELAY_PICS["gmaps_pr02" + getMarkerName(index)], // "components/mondial-relay/assets/gmaps_pr02" + getMarkerName(index) + ".png",
                    shadowUrl: MONDIAL_RELAY_PICS.gmaps_pr_shadow // "components/mondial-relay/assets/gmaps_pr_shadow.png",
                },
                _.pick(MONDIAL_RELAY, ["iconSize", "shadowSize", "iconAnchor", "shadowAnchor", "popupAnchor"])
            );
        };

        /**
         * Reformat the opening hours of the relays
         * @param {Object} opening Structure describing opening times {monday: [{start: "0800", end:"1900"}]}
         * @returns {Array} List of open days [{day: "monday", opening: ["08:00-19:00"]}]
         */
        var reformatOpening = function reformatOpening (opening) {
            var reformatTime = function (openingTime) {
                return openingTime.substring(0, 2) + ":" + openingTime.substring(2, 4);
            };
            var getAllOpenings = function (openingTimes) {
                return _.map(openingTimes, function (openingTime) {
                    return [
                        reformatTime(openingTime.start),
                        reformatTime(openingTime.end)
                    ].join("-");
                });
            };

            var result = _.chain(MONDIAL_RELAY.weekDays)
                .filter(function (weekDay) {
                    return !!opening[weekDay];
                })
                .map(function (weekDay) {
                    return {
                        day: weekDay,
                        opening: getAllOpenings(opening[weekDay])
                    };
                })
                .value();
            return result;
        };

        return {
            restrict: "AE",
            bindToController: true,
            scope: {
                ngModel: "=?",
                userService: "=?",
                mondialRelayService: "=?"
            },
            templateUrl: "ovh-angular-mondial-relay/ovh-angular-mondial-relay.view.html",
            controllerAs: "$ctrl",
            controller: ["$scope", "$q", "$translate", "$timeout", "$http", "mondialRelay", "leafletBoundsHelpers", "leafletEvents", "leafletData", "$injector", function ($scope, $q, $translate, $timeout, $http, mondialRelay, leafletBoundsHelpers, leafletEvents, leafletData, $injector) {

                var self = this;

                this.loading = {
                    init: true,
                    search: false
                };

                this.mapId = _.uniqueId("mondial-relay");

                /**
                 * Render the results into the map and list
                 * @param {Object} data API response
                 */
                this.getResult = function (data) {
                    if (data && data.relayPoints) {
                        this.foundRelays = data.relayPoints;
                        this.referenceAddress = data.referenceAddress;
                        this.map.markers = _.map(this.foundRelays, function (relay, index) {
                            relay.opening = reformatOpening(relay.opening);
                            appendBound(self.map.bounds, relay, !index);
                            relay.marker = getMarkerName(index);
                            return {
                                lat: relay.lat,
                                lng: relay.lng,
                                message: (Math.round(relay.distance / 100) / 10) + " km",
                                icon: getMarkerIcon(index),
                                opacity: 0.7,
                                focus: false,
                                index: index
                            };
                        });
                        this.setMarkerListeners();
                    } else {
                        this.message = $translate.instant("components_mondial_relay_not_available");
                    }
                };

                /**
                 * Register the listener on all the markers
                 */
                this.setMarkerListeners = function () {
                    // kills the old broadcasters
                    _.forEach(this.broadcasters, function (broadcaster) {
                        broadcaster();
                    });

                    // settle the new broacasters
                    this.broadcasters = _.map(leafletEvents.getAvailableMarkerEvents(), function (markerEvent) {
                        return $scope.$on(
                            "leafletDirectiveMarker." + markerEvent,
                            function (event, args) {
                                switch (event.name) {
                                case "leafletDirectiveMarker.mouseover" :
                                    self.markerHover(args.model.index);
                                    break;
                                case "leafletDirectiveMarker.mouseout" :
                                    self.markerHover();
                                    break;
                                case "leafletDirectiveMarker.click":
                                    self.select(self.foundRelays[args.model.index]);
                                    break;
                                default:

                                    // Do nothing
                                }
                            }
                        );
                    });
                };

                /**
                 * Action to perform when the mouse is over the marker
                 * @param {int} relayIndex index of the relay
                 */
                this.markerHover = function (relayIndex) {
                    _.forEach(this.foundRelays, function (relay, index) {
                        delete relay.markerHover;
                        var opacity = index !== relayIndex ? 0.7 : 1;
                        if (self.map.markers[index].selected) {
                            opacity = 1;
                        }
                        self.map.markers[index].opacity = opacity;
                    });
                    if (!_.isUndefined(relayIndex)) {
                        this.foundRelays[relayIndex].markerHover = true;
                        this.map.markers[relayIndex].opacity = 1;
                    }
                };

                /**
                 * Perform a search
                 * @return {Promise}
                 */
                this.search = function (filter) {
                    this.message = null;
                    this.referenceAddress = "";
                    this.loading.search = true;
                    this.ngModel = null;
                    this.foundRelays = [];

                    return this.mondialRelayService.Lexi().search(
                        filter || this.filter,
                        $scope
                    )
                        .then(function (resp) {
                            self.userSearch = true;
                            return self.getResult(resp);
                        })
                        .catch(function (err) {
                            self.message = $translate.instant("components_mondial_relay_not_found");
                            return $q.reject(err);
                        })
                        .finally(function () {
                            self.loading.search = false;
                        });
                };

                /**
                 * Action to perform whan a relay is selected
                 * @param relay
                 */
                this.select = function (selectedRelay) {
                    var relayIndex = this.foundRelays.indexOf(selectedRelay);
                    _.forEach(this.foundRelays, function (relay) {
                        delete relay.selected;
                    });
                    _.forEach(this.map.markers, function (marker, index) {
                        marker.focus = false;
                        marker.opacity = relayIndex !== index ? 0.7 : 1;
                        marker.selected = (relayIndex === index);
                    });
                    selectedRelay.selected = true;
                    this.ngModel = selectedRelay;
                };

                /**
                 * Initialize a search to user location
                 * @return {Promise}
                 */
                this.gotoUserLoc = function () {
                    this.userService.Lexi().get().$promise.then(function (me) {
                        if (!self.userSearch) {
                            var filter = {
                                country: me.country.toLowerCase() || MONDIAL_RELAY.defaultCountry
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
                    }).catch(function (err) {
                        return $http.get(MONDIAL_RELAY.ipLocUrl).then(function (geoloc) {
                            if (MONDIAL_RELAY.metroFrZipValidator.test(geoloc.data.zip_code) && geoloc.data.country_code) {
                                return self.search({
                                    country: geoloc.data.country_code.toLowerCase(),
                                    zipcode: geoloc.data.zip_code
                                });
                            } else if (geoloc.data.city && geoloc.data.country_code) {
                                return self.search({
                                    country: geoloc.data.country_code.toLowerCase(),
                                    city: geoloc.data.city
                                });
                            }
                            self.map.center = {
                                lat: geoloc.data.latitude,
                                lng: geoloc.data.longitude,
                                zoom: 5
                            };
                            return $q.reject(err);
                        });
                    });
                };

                /*= =====================================
                =            INITIALIZATION            =
                ======================================*/


                this.$onInit = function init () {
                    this.logoPic64 = MONDIAL_RELAY_PICS.logo;
                    this.userService = this.userService || $injector.get("OvhApiMe");
                    this.mondialRelayService = this.mondialRelayService || $injector.get("OvhApiSupplyMondialRelay");

                    this.map = {
                        focus: MONDIAL_RELAY.initialLocation,
                        center: {},
                        markers: [],
                        bounds: leafletBoundsHelpers.createBoundsFromArray(MONDIAL_RELAY.initialBoundingBox),
                        events: {
                            markers: {
                                enable: leafletEvents.getAvailableMarkerEvents()
                            }
                        }
                    };

                    this.broadcasters = [];
                    this.foundRelays = [];
                    this.ngModel = null;
                    this.filter = {
                        country: MONDIAL_RELAY.defaultCountry
                    };

                    // workaround to fix display bug on the map
                    leafletData.getMap(self.mapId).then(function (map) {
                        self.leafletMap = map;
                        $timeout(function () {
                            map.invalidateSize();
                            map.fitBounds(MONDIAL_RELAY.initialBoundingBox);
                        });
                    });


                    return mondialRelay.loadTranslations().finally(function () {
                        self.loading.init = false;
                        return self.gotoUserLoc();
                    });

                };

                /* -----  End of INITIALIZATION  ------*/
            }]
        };
    }]);

/**
 * @ngdoc service
 * @name ovh-angular-mondial-relay.service:mondialRelayProvider
 * @description
 * <p>Manage translation path</p>
 */
angular.module("ovh-angular-mondial-relay").provider("mondialRelay", function () {

    "use strict";

    var self = this;
    var translationPath = "../bower_components/ovh-angular-mondial-relay/dist/ovh-angular-mondial-relay";

    /*= ====================================
    =            CONFIGURATION            =
    =====================================*/

    /**
     * @ngdoc function
     * @methodOf ovh-angular-mondial-relay.service:mondialRelayProvider
     * @name setTranslationPath
     * @description Set path to the translation files
     * @param {String=} [path=undefined] Path the the translations or undefined to read the current path
     * @return {String} Current path
     */
    self.setTranslationPath = function (path) {
        if (path) {
            translationPath = path;
        }

        return translationPath;
    };

    /* -----  End of CONFIGURATION  ------*/

    /**
    * @ngdoc service
    * @name ovh-angular-mondial-relay.service:mondialRelay
    * @description
    * <p>Provide translation loader</p>
    */
    self.$get = ["$translate", "$translatePartialLoader", function ($translate, $translatePartialLoader) {
        return {
            /**
             * @ngdoc function
             * @methodOf ovh-angular-mondial-relay.service:mondialRelay
             * @name addPart
             * @description Add loading part (refer to ngTranslate)
             * @param {String} translationPath Path the the translations
             */
            loadTranslations: function () {
                $translatePartialLoader.addPart(translationPath);
                return $translate.refresh();
            }
        };
    }];

});

angular.module('ovh-angular-mondial-relay').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ovh-angular-mondial-relay/ovh-angular-mondial-relay.view.html',
    "<div class=\"mondial-relay\"\n" +
    "    data-ng-if=\"!$ctrl.loading.init\">\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-3\">\n" +
    "            <span class=\"mondial-logo\"></span>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-9\">\n" +
    "            <p data-translate=\"components_mondial_relay_head\"></p>\n" +
    "            <div class=\"clearfix mb-5\">\n" +
    "                <form class=\"form-inline float-right\"\n" +
    "                      data-ng-submit=\"$ctrl.search()\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\"\n" +
    "                               type=\"text\"\n" +
    "                               data-ng-model=\"$ctrl.filter.city\"\n" +
    "                               data-translate-attr=\"{ 'placeholder': 'components_mondial_relay_city_label' }\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\"\n" +
    "                           type=\"text\"\n" +
    "                           size=\"10\"\n" +
    "                           data-ng-model=\"$ctrl.filter.zipcode\"\n" +
    "                           data-translate-attr=\"{ 'placeholder': 'components_mondial_relay_zipcode_label' }\">\n" +
    "                   </div>\n" +
    "                    <button type=\"submit\"\n" +
    "                            class=\"btn btn-primary\"\n" +
    "                            data-ng-disabled=\"(!$ctrl.filter.zipcode) && (!$ctrl.filter.city)\"\n" +
    "                            data-translate-attr=\"{ 'title': 'search' }\">\n" +
    "                        <i class=\"fa fa-search\" aria-hidden=\"true\"></i>\n" +
    "                    </button>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "            <div class=\"text-right\">\n" +
    "                <span class=\"mondial-loc\"\n" +
    "                      data-ng-if=\"$ctrl.referenceAddress && !$ctrl.message\"\n" +
    "                      data-translate=\"components_mondial_relay_search_results\"\n" +
    "                      data-translate-values=\"{ 'loc': $ctrl.referenceAddress }\">\n" +
    "                </span>\n" +
    "                <span class=\"mondial-loc\"\n" +
    "                      data-ng-if=\"$ctrl.message\"\n" +
    "                      data-ng-bind=\"message\">\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- /.row -->\n" +
    "\n" +
    "    <leaflet id=\"{{$ctrl.mapId}}\"\n" +
    "             data-markers=\"$ctrl.map.markers\"\n" +
    "             data-center=\"$ctrl.map.center\"\n" +
    "             data-event-broadcast=\"$ctrl.map.events\"\n" +
    "             data-bounds=\"$ctrl.map.bounds\">\n" +
    "    </leaflet>\n" +
    "\n" +
    "    <div class=\"mondial-results mt-5\">\n" +
    "        <ul>\n" +
    "            <li data-ng-repeat=\"relay in $ctrl.foundRelays track by relay.id\"\n" +
    "                data-ng-mouseover=\"$ctrl.markerHover($index)\"\n" +
    "                data-ng-click=\"$ctrl.select(relay)\"\n" +
    "                data-ng-class=\"{\n" +
    "                    'selected': relay.selected,\n" +
    "                    'marker-hover': relay.markerHover\n" +
    "                }\">\n" +
    "                <div class=\"relay-cell relay-marker\">\n" +
    "                    <span class=\"mondial-marker\"\n" +
    "                          data-ng-bind=\"relay.marker\">\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <div class=\"relay-cell\">\n" +
    "                    <strong class=\"mondial-relay-name\"\n" +
    "                            data-ng-bind=\"relay.name\">\n" +
    "                    </strong>\n" +
    "                    <div class=\"row\"\n" +
    "                         data-ng-show=\"relay.selected\" >\n" +
    "                        <div class=\"col-xs-3\">\n" +
    "                            <span class=\"mondial-relay-address\"\n" +
    "                                  data-ng-bind=\"relay.address\">\n" +
    "                            </span>\n" +
    "                            <span class=\"mondial-relay-city\">\n" +
    "                                <span data-ng-bind=\"relay.zipcode\"></span>\n" +
    "                                <span data-ng-bind=\"relay.city\"></span>\n" +
    "                            </span>\n" +
    "                            <img class=\"mondial-relay-pic\"\n" +
    "                                 data-ng-if=\"relay.pictureUrl\"\n" +
    "                                 data-ng-src=\"{{ relay.pictureUrl }}\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-xs-9\">\n" +
    "                            <ul class=\"mondial-opening\">\n" +
    "                                <li class=\"row\"\n" +
    "                                    data-ng-repeat=\"day in relay.opening track by day.day\">\n" +
    "                                    <div class=\"col-lg-2 col-md-4 col-xs-3\"\n" +
    "                                         data-ng-bind=\"('components_mondial_relay_' + day.day) | translate\">\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-4 col-xs-4\"\n" +
    "                                         data-ng-repeat=\"hour in day.opening\"\n" +
    "                                         data-ng-bind=\"hour\">\n" +
    "                                    </div>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"mondial-relay-city\"\n" +
    "                         data-ng-hide=\"relay.selected\">\n" +
    "                        <span data-ng-bind=\"relay.zipcode\"></span>\n" +
    "                        <span data-ng-bind=\"relay.city\"></span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <!-- /.mondial-results -->\n" +
    "</div>\n"
  );

}]);

angular.module('ovh-angular-mondial-relay-images', [])

.constant('MONDIAL_RELAY_PICS', {default:'data:image/png;base64,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',gmaps_pr02A:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnNJREFUeNpi/P//PwMMnGb0MABSCkAMovmhNAg4MJAGDkDpC0D8EUo/MP2/4wJMASPIYqCFIIPnQy2lJXgAxIlABxxgPMXgDrJ0PwN9gSMTkKhnoD/oZyIj/qgBDJjI0cWswMGgtCELjMkFZFkskmbLIOzvB8HllvSzmM/CCM7mtzSkn8W8piZIbGP6WMwToczAzMML57NJSTNwekrS3mI+Gz1MMVsd2lss5GqPISboakdbi0HZiFNNA8z+fusGw69nTyHxbGJKW4sFwhEp+OPJswzv9h5AyGXo0c5i5Kzzftsxhs/HLiJSt5U+7SxGzjpfVtxl+LzjFsJR5sa0sRiUZUBZBwQ+7IdUZn8f/GD4fOY0RB4Y92zmAtS3GDnLfDpxDsE+iWDzOmgSbTGoPv5PjELVfeUMAo6OeNWAQuK2Uyd1fUzIUvSilBBgIbaYhAFQ3v357BmKPLuUFDj+QUUpKC183/6cOhYLelnB2Q+bJzJ8mHEJRR5UNSp1QBoygt4WQIvXUyeokbMKchaCix24jkiE5kbUi2NYMQnKOqAshA5+nfwALkJBgEtDg7jiN5VBpYGQop8/7jKwCHAzPKybxvDnzhesaj7fvcjAqS7N8LhzOsOPMy+pl52oDUBB/WEA7P0AsnjiAFg8EdaFAXVfEuhk6QJgFyaREdZpg/afQBjUxBBA6rBRCi5Ao/MgqDMH6jfBO224ANAxyA4QgHZ3cKUJkHwjkvwFoCU40w9ei7E4BF8HzxHmG6o3BKAGT8Ai1UiKpST7GCn470ODlgEab47k5GMGEn0NirdEWH5EYpMGQD4mBwNLvP1AHECufoAAAwDngh5h4aRlJQAAAABJRU5ErkJggg==',gmaps_pr02B:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfpJREFUeNpi/P//PwMMnGb0MABSCkAMovmhNAg4MJAGDkDpC0D8EUo/MP2/4wJMASPIYqCFIIPnQy2lJXgAxIlABxxgPMXgDrJ0PwN9gSETkKhnoD+YD/Lx/wGwmIGFWIXMChwM4iWeGOLfrtxl+DDjEskWE+1j1X3lDAKOjljlfj17ynArpYbh+/bnRFvMRLSPeXlwyrFJSTNorprEwGYuQP2gRgbXI7PhbJniBAZeE1MGZh5eBpnKKIZ7AdOo62Nk8GXFXTi+HdoKDmoQEHB2pH5Q4wJ/H/xg+PnsGSQ6gL6mm8XkAootBiUoLg0NeOqmaeKSmhIIZ0vER8GD+PX6LbS1WDo7HUPs+60bDC97ttM/jkF5mVmcYzQfj+Zj6lrMwsdLX4tBdbTsolgGTjVIAfJh/37apmpgYw2r+PNZa+gfx/cqGsGpnOotEE5PSQb5piwM8a/XbzG8nLqZ4dfJD7Rp+tAiVX8YAHs/gCyeOAAWT4R1YUDdlwQ6WboAmCsSGWGdNmj/CYTtQcUuUoeNUnABGp0HQZ05UL8J3mnDBYCOQXaAALS7gytNgOQbkeQvAC3BmX7wWozFIfg6eI4w31C9AIEaPAGLVCMplpLsY6Tgvw8NWgZovDmSk49JLadB8ZYIy49IbNIAyMfkYGCJtx+IA8jVDxBgAHOtGBTe4voHAAAAAElFTkSuQmCC',gmaps_pr02C:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgpJREFUeNpi/P//PwMMnGb0MABSCkAMovmhNAg4MJAGDkDpC0D8EUo/MP2/4wJMASPIYqCFIIPnQy2lJXgAxIlABxxgPMXgDrJ0PwN9gSETkKhnoD+Yz0RG/FEDGLCQqoNZgYNBJM2WgVtLleH3p88Mn49dZPgw4xLJNoPi+D+xioXLLRnka4oYmHl4UcS/37rBcN29guHvgx9EW8xErEJOT0kGpY56DEvBcmoaDJo7O0jyMdEWS6YHwtkf9u9nuB6ZzXA7s4zh17OncMvZzAWItpjoOBZwdgTTIItuO3XCxX8+rGGQb8pi+Hr9FsOvkx+obzEsiH8+e4Yav9ufM9zYXkty4mJiGCAwavGoxaMWj0CLWfh4MapJpQ1Z4JqLJhaDKgZYZSDe5gq3FFQrCfv7gWsuUA1G9fqYJ0KZQXP5VJzyoMrjonQy9X38ZcVdhnsVjVjl/n75zHArpYZ2LRCYz8Ui3BnYpCHB+unkOYaXPdtJan2QZTE1U/WHAbD3A8jiiQNg8URYFwbUfUmgk6ULgF2YREZYpw3afwJhe1ATC6nDRim4AI3Og6DOHKjfBO+04QJAxyA7QADa3cGVJkDyjUjyF4CW4Ew/eC3G4hB8HTxHmG+oXlZDDZ6ARaqRFEtJ9jFS8N+HBi0DNN4caV47QeMtEZYfkdikAZCPycHAEm8/EAeQqx8gwAAZyQqAepDNzwAAAABJRU5ErkJggg==',gmaps_pr02D:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdFJREFUeNpi/P//PwMMnGb0MABSCkAMovmhNAg4MJAGDkDpC0D8EUo/MP2/4wJMASPIYqCFIIPnQy2lJXgAxIlABxxgPMXgDrJ0PwN9gSETkKhnoD+Yz0RG/FEDGLAQq5JZgYNBvMQTQ/zblbsMH2ZcItlmoi1WmpfPIODoiFXuV+1ThlspNQzftz8n2mImon3My4NTjk1KmkFz1SQGNnMB6vsYGVyPzIazZYoTGHhNTBmYeXgZZCqjGO4FTKOuj5HBlxV34fh2aCvDr2dPweICzo7UD2pc4O+DHww/nz2DRAfQ13SzmFwwavGoxaMWj1oMKfD5eOlrMaiOll0Uy8CppgHmf9hPfAuKrNoJ2FjDKv581hr6x/G9ikZwbUV1Hz+sm8Yg35SFIf71+i2Gl1M3M/w6+YEkh4Kat/8HKlV/GAB7P4AsnjgAFk+EdWFA3ZcEOlm6AJgrEhlhnTZo/wmE7UHNJ6QOG6XgAjQ6D4I6c6B+E7zThgsAHYPsAAFodwdXmgDJNyLJXwBagjP94LUYi0PwdfAcYb6hegECNXgCFqlGUiwl2cdIwX8fGrQM0HhzJCcfk1pOg+ItEZYfkdikAZCPycHAEm8/EAeQqx8gwACYYO15g2Ar3QAAAABJRU5ErkJggg==',gmaps_pr02E:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZtJREFUeNpi/P//PwMMnGb0MABSCkAMovmhNAg4MJAGDkDpC0D8EUo/MP2/4wJMASPIYqCFIIPnQy2lJXgAxIlABxxgPMXgDrJ0PwN9gSETkKhnoD+Yz0RG/FEDGLAQq5JZgYNBvMQTp/zLnu0Mfx/8INpmoi1WmpfPIODoiFOeW0uN4bZTJ9EWMxHtY14evPI/njwjKaxZyImg65HZGGJfVtylvcWkWkJRUFMbjDyLyYpjqSmBKPxPRy7RJ3FJZ6ej8RkYzp0IIKkAoUpQ//3ymSRLqZaPv594Sp84Hs3HoxbTLHEBG2sYYvcqGhnedh6nv49FQ7xo4+OHddMY5Juy8MqTAkDN2/8Dlbg+DIC9H0AWTxwAiyfCujCg7ksCnSxdAMwViYywThu0/wTC9kAsgNRhoxRcgEbnQVBnDtRvgnfacAGgY5AdIADt7uBKEyD5RiT5C0BLcKYfvBZjcQi+Dp4jzDdUL0CgBk/AItVIiqUk+xgp+O9Dg5YBGm+ONK8koPGWCMuPSGzSAMjH5GBgibcfiAPI1Q8QYAB6yeVm12Hk3gAAAABJRU5ErkJggg==',gmaps_pr02F:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAYxJREFUeNpi/P//PwMMnGb0MABSCkAMovmhNAg4MJAGDkDpC0D8EUo/MP2/4wJMASPIYqCFIIPnQy2lJXgAxIlABxxgPMXgDrJ0PwN9gSETkKhnoD+Yz0RG/FEDGLAQq5JZgYNBvMQTp/zLnu0Mfx/8INpmoi1WmpfPIODoiFOeW0uN4bZTJ9EWMxHtY14evPI/njwjKaxZyImg65HZGGJfVtylvcWkWkJRUFMbjDyLyYpjqSmBKPxPRy7RJ3FJZ6ej8RkYzp0IIKkAoUpQ//3ymSRLqZaPv594Sp84Hs3HoxaPWkyRxQ/rpjF8PnOa4V5FI1UsBjVv/w+Ujz8MgL0fQBZPHACLJ8K6MKDuSwKdLF0A7MIkMsI6bdD+EwjbA7EAUoeNUnABGp0HQZ05UL8J3mnDBYCOQXaAALS7gytNgOQbkeQvAC3BmX7wWozFIfg6eI4w31C9AIEaPAGLVCMplpLsY6Tgvw8NWgZovDnSvMiExlsiLD8isUkDIB+Tg4El3n4gDiBXP0CAAQD1c+AQFsZ7KAAAAABJRU5ErkJggg==',gmaps_pr02G:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAi1JREFUeNpi/P//PwMMnGb0MABSCkAMovmhNAg4MJAGDkDpC0D8EUo/MP2/4wJMASPIYqCFIIPnQy2lJXgAxIlABxxgPMXgDrJ0PwN9gSETkKhnoD+YD/Lx/wGwmIGFVA3MChwMImm2DMx8PGD+pyOXGL6suEuyxST5WCBDj0Gpu5aBmYcXRfzD/v0M95ImMvx98IP6FnN6SjLobJuPUx5k+W2nTqItZiJWoWR6IIol1yOzGW5nljH8/fIZEhqOjrSJYwFniMG/nj1F8dn1h3kMyhPKGd7tPkgbi2Hx+vPZMxTx79ufM1zZXkBy4mJiGCAw8ixmIVej1JRABunsdDgflLqvh+WB45ymPpaIj8JIfILeFrQP6octfQyfz5xm+H7rBn3j+G3ncYYbprUMD+onj6Zq2ljMwodaM7EIcNPWYlDFAK6l1DQYZBfFwmss+dp8uJr3W09Qv1rkiVBm0Fw+Fac8KIWDEhvVfQxqZdyraMQqB8pSt0NbadcCAQE2cwEG8WxfBm5NNYa/n78wvNt5CJy1aNr0oXaq/jAA9n4AWTxxACyeCOvCgFpxCXSydAGwC5PICOu0QftPIGwPamIhddgoBReg0QlqlB0A9ZvgnTZcAOgYZAcIQLs7uNIESL4RSf4C0BKc6QevxVgcgq+D5wjzDdXLaqjBE7BINZJiKck+Rgr++9CgZYDGmyM5+ZiBRF+D4i0Rlh+R2KQBkI/JwcASbz8QB5CrHyDAAH4+IBOv9FOVAAAAAElFTkSuQmCC',gmaps_pr02H:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIOSURBVFiF7Ze/axNhGMc/b+wvotBbLIZSUMRUK0KW69BavEzJpqLONqOTi5uIdNDFoe0fUKrdu8rVpVfEJYGSsdqhXa4VoXi2UL2E+jjkrk2anN4FLyDmC8f73vM87/N5f/C+8CgRwVdJ5TPARSADDHotgEE0WV5bBr557bYuZtkPUCJCSeUNYNGDxqltoKCLaakiOQNYjRl4WtkE8LzDUIDZBCHPL6mn0e7fRPX2NPlUzxm0B1Mk9XRYcKY5Swv1p4e58v4VKMXusyW+zC7TOzQIQNV2OP/4NqmX0yDCxo1HuJs7f8yZCAM+OzEGSgFwbvI6VIWq7VC1nZp/cqwWqBTJ8dEwKcOB41AX3AXHplD3uF79o8OkXjxssA1cHYkf3HfpAkNP7kUGnda/s9WVrc84yx8abNrdCfoup+IFux9tdp++abANXBuJDP7/rlMX3AUD8PO727J/Yqsc9+VHpcnfNvjgbQn3k83R/iF7CytN/r2FFY72D3E3dzh4tx4KrIrkvgJaqOi/JycBzHcYCjDvlzCLwHSHoK91MQvKL9q8+skAblHb+kzg0GgqAw6wBli6mBZ4RVuQSipfPwGNWrnjBIRrwEydv6yLGRT7e3CLiRgEF3hZfzVhFOkB8RLPtXDNRIFCxBXD8fZvcXIFLV3MbKQktPFkeudW8H7r+9EkIm19RXKrRXJ32h3/CyS69632uPvlAAAAAElFTkSuQmCC',gmaps_pr02I:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAF0SURBVFiF7Ze9SgNBFEbPhGgVNBiwsFB7LbbZSsSNIEnpI5iHEOwkT6DBB4jY2VptI1nbTbMPIBi0U0giFhITvRaZ1SBZcUYTEPaDZWaZe++ZH2bgUyJCrKYqO8Aq4ADzugXwMFOg2wh41G3LFT+KA5SI0FRlD6hr6CTVAiqu+IEKKXlAY8LArypmgMMpQwGOMhieX7YwR6Gyw8zSwm/ATtY0Y+X8gNzmOi+391xv79O/61iRM6YJuY01AGaXF5GBsoJagf9KKTgFp+AUnIJTcAr+h+C3596wIwK9/vTADycXyOCV9tklg/aTNViFlDpA3rqCnboZoDZlKEAttjB1YG9K0FNX/IqKTZv2Tx6wxXDrncRUM0VAF7gCAlf8ALRpS1JTlUcnkGdod7oJ4XmgOjIeueInxX4PHjMRj2SDV4xX8xMZXSdd+HjMUNUECoYrho/tv+HzCgau+EWjIlg8IPrcKvp3tG8mEbH6QkqNkNKubf47XATKtMYgB6AAAAAASUVORK5CYII=',gmaps_pr02J:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAH1SURBVFiF7Ze/i9RAFMc/k9v1JBzeKigiIiILh4UQhVxhc1kQdgsR/wS3EDtBSxu91kYPOwvvKv8Ci4DFRQWRrMUWgoKKJ7JyILhR9FCy+CxuspuTi2Ti7TbmC2EmM++9z/wgmXlKREjUUS0HOAo4wKwuATzMFOiyC3zR5ZorfjcxUCJCR7U8YFlDx6k1oO2KH6iQpgesjhn4pxoWcH3CUIBbFub7t1WWYs/ZeWYWTph4OZVCsKqiemAWgBnvJEfuXQHg7ZlrfHvyIlcIqxA4FuJeRNyLsOfnhs326eO5QxQD74BKcAkuwSW4BP8PYEuN6qn729jBtnNsWB+s93P7GV0E7FN1Kof2sfH8NfIjZv/lc6PzWITvT1/uPHh67jD1xzdRVe3yS7Ysc/9+wM83H3ODcy+1ZU+jKlOphhH064OQD5fu5IYCTF2kfiOP4WC9T/z+E9buXVQP7gVg49krPq88pHf1LhIPjMAqpNkHakZe/67IApYmDAVYSlKYZeDChKArrvhtlSRtOn/ygAU2l97JdDVTF4iAR0Dgih+ATtqy1FGt9ABqbKY7UYZ5DVhM9Xdd8bNs/w7eZiAe2QleI5lNHhn9MnXg29t0LZpAwXDGMFz+d4w+wcAVv2EUhAKHhN63tn5N180kIoWekOZqSPN8Uf/f+t3ra0F0hz8AAAAASUVORK5CYII=',gmaps_pr02K:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMMSURBVFiFvZdfSFNRHMc/d27+x02pKaWS0X9BfGgFIjajUILA0AqMUCF66KEHU6IXw+cSFeohiTSEXsrooXD0oKvelGBG0INgGk10+ecW2tQ7d3rY3XWV03un8wvjnN/O7/w+59x7fmf7SUIIwhqWKouBfUAxYFVbACfG5FZbD/BTbccdwuUJO0hCCIalSifQrULjqXGgwSFcbmmICicwGGfgvyo3AXd3GArQbkLH+5OSLGTWOkkpKojqk15aiPVCCVKCSQ+42KzHK6elFntTNSKwypdD11B8c1jsVgAUr0xW3Rnyum4C4G3sYubh601j6lpeWslRACRzAqknDoMiULwyilcm6cAe9rZfXwuYnKgnpD5wNEnmBPKf3sKUlgyA4p1l7snb+INzWmpJPX4wZAQFE/VtBOYX4gtOLy3E3lyj2b62Phbff9Y9PyZwgjWN/J5GMEkA/P44ylTrM0MxYgLnPriBJW83AMHFJb7VtSGUgKEYutIpUllXysk4f1KzJ5seszw6aTSM8R1HQhcGPzGr8xRvGRyp5GP5uvN2W8HmbBuZDWd3DrwyPq31s5uqkSyGj4pxsN8zxmhZM8EFPwCW3F1kXT0df7Dvfh+BaZmZR/3ad/bmGr2/SrGDRWAVgB8drwj6VwBI3J+D7XJZfMFhBXwyc91rqWS/fVG7yeIKBvC1vdRurOQjeVirSnYGrHyfYa53QLOz71zaGTCA794LxGoQgJSiAjLOObYPLJYUrR/0L/81tjI2hfz8g2aH/61sC3imq5/g4hL+kTEWBkb+G59q6WVlwkdwcYlfb4Z1gaUhKuYB26YrTEnU0mfdQBZzKNUiKpMNJJuATj2eG0GB0OnWBwXoDJcw3UC93llbVI9DuBqkcNGm1k9O4BShR18cdaoxeQAZeAe4HcLlBrVoi6ZhqTJyATZC5Y4cxd0GtEaMexzCFc13Y/A6C3ESvcArD+9GjwxdIGrgjnWGWo1AweCOQXv8X1lLQbdDuMoNBSGGK1N9bw2qGdk3JiFETJ8hKgaHqKiKdf4fIqFfaeoPC40AAAAASUVORK5CYII=',gmaps_pr02L:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAG+SURBVFiF7Zc9S+RQFIafm3HZXRU2NrKlrMVUQgqDpZkqU1rYiAhOtf9gK0EstltQwV79DTZhWTC2mWbYys5RsPADjKCs7jhzLLzRUYzeDONgkRfCSXLOvc/9IDfnKBEhUVWVHWAEcIAv2gJ4ZFOobQ0417buSlBLApSIUFVlD1jX0LdUHai4EoQqwveA7TcGPlXJAhZ7DAVYtjDcP/XxA0MzHp+db90AO32mkV8XZhj+MY00W+yOfUeurgFoHMYdkS3TwP6JIgCqYNE/XqRxGHcMzQTutnJwDs7BOTgH5+D3BzZOBNpVGPhEwR589K518Q+5aRr3oSJ8eT0MRn//ZHByLNV/cxyzP/eLi/CvEdh4qZvnly/6+4ZthmZLpt2Zg0/XtmgcnKT6/9ePONv8YwxWEf4ZYBu36I5iC1jtMRRgNSlh1oH5HkE3XAkqKinadP3kAZPcLb2T2jSbakAM7AChK0EIumhLU1WV2wdgc1fupCXTNrDU5q+5EqQm3i+CnxmIR3qBV0pmY6JMR6bueOUZ11IWKGScMdwv/x4Pn2DoSmB+cmhl/knofavox/b7bBKRjq4IfzvCn+q0/S2x8t9T2a+QUAAAAABJRU5ErkJggg==',gmaps_pr02M:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKaSURBVFiF7ZfNaxNBGIef2aZCP7SpYKueVFrwIBq1gYJgk4qkelGLgsUe2j9BRG9Fe9GDiPbsoYIU9eBHRXFPTXpSUw+xp16kgVJoKCWbUjFm046HbLbBJt3MNgke/EGYr9+8z87s7JBXSCnJa0b0+YBDgA9osUqAAGqKWGUMSFll3C/1WN4gpJTMiL4AMG5Bq6k4MOyXekRECQWAcJWBfyuoAXdrDAV4rOH0/jRB640gzcHjjtGaz/lovd4DmnCy+jxOjrabVzhwfwg2JD8ujrAWnoV6QX1bCwDmogHAngtdHH47AkLgafeyPDa5/XqcwA2nOiynYP+9wVzdlJiLhg0FaB8ZAJFbaePpTqewzuBCNXUfpenssS39zb0nyoK5BgO037lWVl/FwbvPn6TBd8RuN3Z1lnXwdgwGaLt9tWhdRY6nupi8/WdY6jgIdRotl7prB0YT7LvVj/DU2SdZOYSKeS08a9f3DvbSOtCzOTb1vXrg1IevpOcWABC7PIj63Ial5xYwJj9XD4yULD96s6V7+eFrhCzirxgYSL6YxlxcsduZeILky2nVMOpgaWZJPHhlt5dGJ5DZdWWwq1O98lQnmzCQZpbVT9/chHD5OQGp91/cTgVc3lyV0H/wvwPeSGfsukybZfk2fv3eOTj5fIr11E8y80uk3pW+Flc/RsnEE6wbayQnnP8tiyihJOB1dFZWhgaM1RgKMJZPYcaBoRpBn/mlPizySZuVPwWAHnJb7ys5VU0xwACmgYhf6hGwkrZSmhF9hQ/gJZfuGCXsXmC0YDzml3op7/bgIg8SoHSCF8yvphwpXSBW4CdFhkZVoKC4YrC3f57NTzDil3pQKQgurkzrvQ1bzcK6mqSUrn5RQuEooctu5/8Bh2csykYYoQsAAAAASUVORK5CYII=',gmaps_pr02N:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKkSURBVFiFxZdPSBRRHMc/s+7qKojrv7Ui2zpYSFIbMXQRWg+2EgSB5qWL1iU6G3gLLxF1MIkuFdgtMg/enEPhatRht3APEWhEFghpiGP+Q8ed12FmJ1HX2ZnF6QvDe4/3ffP5vfdmHu8nCSHIKiW1RYHjQBSoMEuAGM6UMMs0sGSWM7JQ0lmDJIQgJbXFgEETepCaAbploSSkJPEYMHbAwJ1q8QF3PYYC9PvIY//8dSFqbl0mcLQmt+dQJdU3LuGvrcgHHJWSxIWd69SnxwSbImz+mGfq7G30LY1A2ABos6rhST8h2FjPWmqar809tmSfnUEq9hNsigBQHAlTdTMOmkCbVS1oUXkpwcZ6AMrkkyBJhYN3qq6nHakksCM6e1DBYP/hKqq7Wh2DCgYDhHvakfxF3oMDx2qpvN7iPRggfKcDfM731jVYZHQAShqOEOpo9g6sDk1Y9breTldftCvw7/4RhLYFQPB0hIorF7wBaz/nWXw5brXDvde8AQPMPxwG3Thpy843UN56zhvwxvQsSyMfrHa4t9MbMMDcg2GrXnrmhHfg9clv/Bn96Ha4ezDA3L1X/we8lpxi+c2k92BwP+uCwavvv7A68fkAwBkdsWmcVCKjo2uZXZZf94esetZbMFhkdBaejhrlcwV9ZX2XZ+VtGvX1OwAWnikgbK9xSEnii0DINsKyEvS1jX09ReWlZJZ3B7aHVB8wkI/TDgrkCwUYyKYwg0BXvqMK1AtZKN1SNmkz86cYcBFj6aM5hzpTGlCBcSAhCyUBZtKWSympbXsAIYx0R81hDwF92/rTslByefcH7xFIjNwJXkt2NvnI0QFivvjRHl19TqDgcMZgLf93/v2CCVkoju+6jo9Mc9+6zeb2ujMJIVw9SeJjSeJX3Y7/Cy4tN9vnUUg4AAAAAElFTkSuQmCC',gmaps_pr_shadow:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAaCAYAAAAqjnX1AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYSDRkDUD0FHwAABWRJREFUWMO9WNtu20gWrDrNJsXIkofxJRNPsFlAyIuf/f9fkNc8BgMMZomsb7IpmxLJZtc+TMtQHGcu9sw2QECU1KeL1efUqSbx/EEAXCwWbJrGvPduHEcCgHNOZVnG9XodT05O4sePH5Xm6LkLPWveYrEwAK7ve29m+TAMRZZlGQBIGsdxHLIs67uuG2KMYT6fx8+fP8fngHV/FdzZ2ZkNw5AVReFDCK8AzGOMB865IwCHkipJM+fcBIB3zjmS9N4jyzKcnp6qrut/jEkuFgsbhiEDUEiakpwDeB1jfA1gn+QkxRwA3AO4JXkbY7wFcBdjbMdx7JxzQ13XMTGqvwMkz87O2Lata9vWA3g1juMMwGuSh5IOAbwGMJNUkKSkQLKVtCJ5K2lpZtcxxhsATVEU9wB6AGNKAb0E5AN7McYJgKmkyswOABxJOiJZAZgBmADIJJHkmNjcALgD0AC4lnRJ8lLSchiGOwDrP8Mq/4i91WqVO+fKEMIcwAGAI5JHkg5I7ifgBYCM5G68CCBI6kmuJa0AXJO8BHBO8iqEcJvn+b1zrvs9Vp8CaScnJwYgM7NC0p6ZVSQPY4zHCWQlaZZy0AOwrSTtxNkyEwEEAF1i9QbApaQLABeSrrMsa4ZhWAMIdV2Pj4G6x5VblmUWQiicc3skX5N8A+AnAD+RfEvyEMA+gBKAJ+l2QH6jo+lyKRXy9GDby5uZxRhpZjKzWBSF2rb9Sqbc7vaen5/7vu9fOef2SR4BeLsFKOlNyr89ADnJjKT9mbxOl23BAsgTyIKkT3EAIJIcJ5NJbNv2W5CbzcZnWVY65yoAPyZw7yS9JXlAcl/Slj17RiNgGpYe0JPMJeU7MUVyNLNxNpvF1WqlB5CLxcLleZ5LmgE4BvAuAdyyN03y4p4J8JsUkOR2wPp0L5K9974jOXz48CHWda1su2Df95ZlWSFpL+XcPslZYi97IbinWDVJPn0GyQCgBdCM49gAWC+XywDgIRd+K2uzSDKmitRuRPwDI8UlAJOUpeJyMUbbmhWkJFZVVVqv1yGE0JFcAVhKmqYE3zKY/Y1MStJX0kSySR2qBTB47+NXhVPXNSaTCSeTidJ4IDdtdZb+yxe6p612jiR7ki3Jm6SZX8zsi6RL733jnOuqqop1XetBJ09PT9F1nWKMI4CQtp1JrH0Cai8AusvehmQD4ErSf83sPwBqkhdmdtP3/cZ7Hz59+qTHC21NbNZ1XWlmlaQTAP+W9C6ZiBKAS0nPHX3jH4BT6uc9gPVOL7/YtkiSN6lwOu992G2R9ngrqqoKMcZOUpvsVpsCb+/v02+dpCGx8z1z8LC1ae4NgC8AfgHwM4CfzexXAOfe+9sQQnt8fDw87uH8jvPxfd/vSXoD4F8kfwQwT9VnqYgKkmXyln7HYDDRF3cAtpIaANcALszsPMZ4BeA2hNBOp9PfNRjZU/vTNI2KohhJbtLTE8CtJO7kaZmAz0hOd6yaJXkJO1btJlm0CzO7kLR0zt1tNpuNc26XuSet2pMg5/N5HMdxiDHexRhJ8j7G6EgqAcgATAHsS6qSZXsQ/rRYJ+luyx7JS5JXkppxHNs8z/u9vb0XmV47Ojpy0+nU932fA8jyPEcIYQvSSZoA2CP5g6Qf0lFiCiBPGrZJx4crAFckb0MId+n7Jy3Z90b2vYp8//79WNe1hmEYyrI055yc+02xhmFgKoS7JCXXCeCrZMckqTOzFYDGzO7GcVyXZTlUVRXSEVd/peE/67fFYsHlcumm06kfx9GbWUEyT/4SJAeSHYAuxtg/lpX/x7n7Ye5isbCmaawsSzOzhxcEeZ7HYRhiCGHceUHwrJcD/wPewzAtNpw0tgAAAABJRU5ErkJggg=='})

;