/**
 * @type directive
 * @name ovhDirectives:clickRoute
 * @description
 * Change route location on click.
 * # Usage
 * Add attribute `click-route` with desired route directly on an html element.
 * @example
 * Html view :
 *<code:html>
 *<button type="button" click-route="/configuration/adsl">Configuration ADSL page</button>
 *</code>
 */
angular.module('ua.clickRoute').directive('clickRoute', function () {
    'use strict';
    return {
        'restrict': 'A',
        'scope': false,
        'controller': 'clickRouteCtrl'
    };
});
