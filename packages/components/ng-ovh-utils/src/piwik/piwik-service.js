/**
 *  Service to track
 */
angular.module('ua.piwik').provider('Piwik', function () {
    'use strict';

    var defaultPage = '',
        siteId,
        piwikPath,
        piwikTitle = 'piwikTitle',
        scriptCreated = false;

    /**
     * Helper function to build path
     */
    function buildPath(p) {
        return (("https:" === document.location.protocol) ? "https" : "http") + "://" + p;
    }

    /**
     * Helper function to create script tag
     */
    function createScriptTag () {
        var d = document,
            g = d.createElement('script'),
            s= d.getElementsByTagName('script')[0];

        g.type = 'text/javascript';
        g.defer = true;
        g.async=true;
        g.src = piwikPath + '/piwik.js';

        s.parentNode.insertBefore(g,s);

        scriptCreated = true;
    }

    // Define extra global _pag for piwik
    window._paq = window._paq || [];

    /**
     * To set a special piwik path
     */
    this.setPiwikPath = function (path) {
        if (angular.isString(path)) {
            piwikPath = buildPath(path);
            createScriptTag();
        }
    };

    /**
     * To set tracking site
     */
    this.setSiteId = function (id) {
        if (id) {
            siteId = id;
        }
    };

    /**
     * To change the default tracking page
     */
    this.setDefaultPage = function (defPage) {
        if (angular.isString(defPage)) {
            defaultPage = defPage;
        }
    };

    /**
     *
     */
    this.setPiwikTitlePath = function (p) {
        if (angular.isDefined(p)) {
            piwikTitle = p;
        } else {
            piwikTitle = 'piwikTitle';
        }
    };

    /**
     * Return the service
     */
    this.$get = ['$rootScope', function ($rootScope) {

        var trackOnRouteChange = false,
            unregister;

        function track (page, variableName, value) {
            try {

                if (variableName !== undefined && value !== undefined) {
                    window._paq.push(["setCustomVariable", 1, variableName , value, "visit"]);
                }

                window._paq.push(["setDocumentTitle", page || defaultPage]);
                window._paq.push(["trackPageView", page || defaultPage]);

            } catch (e) {
                throw "No Piwik founded";
            }
        }

        function registerEvent() {
            return $rootScope.$on('$routeChangeSuccess', function (scope, route) {

                var title,
                    p = piwikTitle;

                if (trackOnRouteChange === true) {

                    if (angular.isDefined(p) && angular.isDefined(route[p])) {

                        title = route[p];

                        if (title !== null && title !== undefined) {
                            track(title);
                        }
                    }

                } else {

                    if (angular.isFunction(unregister)) {
                        unregister();
                    }
                }
            });
        }

        function init() {
            if (scriptCreated === false) {
                createScriptTag();
            }

            window._paq.push(['setSiteId', siteId]);
            window._paq.push(['setTrackerUrl', piwikPath + '/piwik.php']);

            if (piwikPath === '') {
                piwikPath = buildPath(document.location.host) + '/piwik';
            }
        }

        init();

        return {
            trackOnRouteChange : function (trackOnRoute) {

                trackOnRouteChange = trackOnRoute;

                if (angular.isFunction(unregister)) {
                    unregister();
                }

                if (trackOnRoute === true) {
                    unregister = registerEvent();
                }
            },
            track : function (page, variableName, value) {
                track(page, variableName, value);
            }
        };
    }];
});
