/**
 * @ngdoc directive
 * @name ovhDirectives.directive:stargate
 * @element ANY
 *
 * @decription
 * Navigate, like Stargate, in Universes! Provide a navigation menu, given by WS.
 *
 * @version 1.0.0
 *
 * @example
 * <code:html>
 *
 *     <ul data-stargate data-ng-show="gates" class="nav"></ul>
 *
 * </code>
 */
angular.module('ua.stargate').directive('stargate', function () {
    'use strict';
    return {
        restrict   : 'A',
        replace    : false,
        controller : 'stargateCtrl',
        templateUrl: 'components/ovh-utils-angular/stargate/stargate.html'
    };
});
