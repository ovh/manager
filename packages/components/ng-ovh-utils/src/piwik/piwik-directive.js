angular.module('ua.piwik').directive('piwik', ['Piwik', function (Piwik) {
    'use strict';
    return {
        restrict    : 'A',
        link  : function ($scope, elm, attrs) {

            var oldVisibility,
                currentVisibility = $(elm).is(':visible'),
                interval;

            if (attrs.piwikOnShow) {

                interval = window.setInterval(function () {
                     // update currentVisibility
                    currentVisibility = $(elm).is(':visible') && $(elm).children(':visible').length > 0;

                    // check if change and if is visible
                    if (currentVisibility && currentVisibility !== oldVisibility) {
                        Piwik.track(attrs.piwik);
                    }

                    // update old visibility
                    oldVisibility = currentVisibility;

                }, 500);

                $scope.$on('$destroy', function () {
                    window.clearInterval(interval);
                });

            } else {
                Piwik.track(attrs.piwik);
            }
        }
    };
}]);
