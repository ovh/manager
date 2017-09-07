/**
 * @type service
 * @name ovhServices:SessionFetcher
 * @description
 * fetch the session
 * @example
 * # Usage
 * <code:js>
 * angular.module('app').run(['SessionFetcher', function (SessionFetcher) {
 *      'use strict';
 *      //fetch '/auth/fetch' every 15 minutes
 *      SessionFetcher.init(null, null, true);
 * }]);
 * </code>
 */
angular.module('ua.sessionFetcher').service('SessionFetcher', ['$http', 'constants', function ($http, constants) {
    "use strict";
    var url, elapse,
        to = null,
        isFetching = false,
        stopFetching = false,
        self = this;
    /*
     * @type function
     * @name ovhServices:SessionFetcher.init
     * @description
     * the service initialisation
     * @param {string} nUrl api url
     * @param {int} nElapse time beetween each fetch
     * @param {boolean} autoStart auto start fetching
     */
    this.init = function (nUrl, nElpase, autoStart) {

        url = nUrl ? nUrl : constants.swsRootPath + 'auth/fetch';
        elapse = nElpase ? nElpase : 1500000;

        if (autoStart) {
            this.run();
        }
    };

    this.fetch = function (withAutoRun) {

        to = window.clearTimeout(to);

        if (!self.isFetching()) {

            isFetching = true;

            $http.get(url).then(function () {

                if (!self.isStoping() || withAutoRun) {
                    self.run();
                } else if (stopFetching) {
                    stopFetching = false;
                }

                isFetching = false;
            });
        }
    };

    this.run = function () {
        to = window.setTimeout(function () {
            self.fetch(true);
        }, elapse);
    };

    this.stopFetching = function () {
        stopFetching = true;
        to = window.clearTimeout(to);
    };

    this.isStoping = function () {
        return stopFetching;
    };

    this.isFetching = function () {
        return isFetching && !stopFetching;
    };

    this.setDelay = function (delay, autoStart) {
        this.stopFetching();
        this.run(url, delay, autoStart);
    };

}]);
