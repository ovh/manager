/**
 * @ngdoc filter
 * @name ovhFilters.filter:moment
 *
 * @example
 * <h1>Date formatted: {{date | moment:'MM/DD/YYYY HH:m A'}}</h1>
 */
angular.module('ua.moment').filter('moment', function () {
    "use strict";

    return function (date, format) {
        if (angular.isString(date) && !window.moment(date, format).isValid()) {
            return null;
        }
        return window.moment(date).format(format);
    };

});
