angular.module('ua.clickRoute').controller('clickRouteCtrl', ['$element', '$attrs', function ($element, $attrs) {
    'use strict';
    if ($attrs.clickRoute) {
        $element.css('cursor', 'pointer');
        $element.click(function () {
            var route = $attrs.clickRoute;
            if (!$.isEmpty(route)) {
                window.location.hash = route;
            }
        });
        $element.removeAttr('click-route data-click-route x-click-route clickRoute');
    }
}]);
