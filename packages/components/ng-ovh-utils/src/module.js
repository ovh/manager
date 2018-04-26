/**
 * @type module
 * @name ovh-utils-angular
 * @see [url=http://docs.angularjs.org/api/ng.$http]`$http`[/url] service.
 * @description
 * Application level module which depends on the below modules.
 * # Modules
 * [url=#/module=ovhDirectives]`ovhDirectives`[/url]
 * [url=#/module=ovhServices]`ovhServices`[/url]
 * [url=#/module=ovhFilters]`ovhFilters`[/url]
 * # Response interceptors
 * `$httpProvider` use interceptor [url=#/module=ovhServices&service=HttpInterceptor]`HttpInterceptor`[/url].
 */
angular.module('ovh-utils-angular', [
    'ua.wizardForm',
    'ua.wizard',
    'ua.typeOff',
    'ua.triStateCheckbox',
    'ua.translator',
    'ua.tooltipBox',
    'ua.timePicker',
    'ua.substring',
    'ua.storage',
    'ua.step',
    'ua.stargate',
    'ua.sessionTimeout',
    'ua.sessionFetcher',
    'ua.preserveScroll',
    'ua.popover',
    'ua.paginationServerSide',
    'ua.navigator',
    'ua.moment',
    'ua.logger',
    'ua.inputNumber',
    'ua.i18n',
    'ua.httpInterceptor',
    'ua.highlight',
    'ua.grid',
    'ua.flexTable',
    'ua.extendedAccordion',
    'ua.event',
    'ua.elasticArea',
    'ua.dateTimePicker',
    'ua.contracts',
    'ua.clickRoute',
    'ua.alerter',
    'ua.agreements',
    'ua.price',
    'ua.poll',
    'ua.ignoreSpaces',
    'ua.humanReadableSize',
    'tmh.dynamicLocale'
]).config(['$httpProvider', function (http) {
    'use strict';
    http.interceptors.push('HttpInterceptor');
}]);
