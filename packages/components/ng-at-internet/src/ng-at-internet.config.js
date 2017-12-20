"use strict";

angular.module("ng-at-internet")
    .config(function ($provide, atInternetProvider) {
        $provide.decorator("atInternet", function ($delegate) {
            var delegateTrackPage = $delegate.trackPage;
            var trackPageRequestQueue = [];
            var settings = {
                queueLimit: 30
            };

            // Decorate trackPage to queue requests until At-internet default configuration is set
            $delegate.trackPage = function () {
                var defaultsPromise = atInternetProvider.getDefaultsPromise();
                var trackInfos = arguments;

                if (defaultsPromise && angular.isFunction(defaultsPromise.then)) {
                    defaultsPromise.then(function () {
                        delegateTrackPage.apply($delegate, trackInfos);
                    });
                } else if (atInternetProvider.isDefaultSet()) {
                    trackPageRequestQueue.forEach(function (trackPageArguments) {
                        delegateTrackPage.apply($delegate, trackPageArguments);
                    });
                    trackPageRequestQueue = [];
                    delegateTrackPage.apply($delegate, trackInfos);
                } else {
                    // Limit number of delegate track in queue.
                    if (trackPageRequestQueue.length > settings.queueLimit) {
                        throw new Error("atinternet too much requests are waiting in track page request queue");
                    }
                    trackPageRequestQueue.push(trackInfos);
                }
            };
            return $delegate;
        });
    });
