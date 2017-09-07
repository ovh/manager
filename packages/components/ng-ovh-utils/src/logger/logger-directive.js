/**
 * @type directive
 * @name ovhDirectives:logger
 * @see [url=http://docs.angularjs.org/guide/ie]Internet Explorer Compatibility[/url]
 * @version 1.0.0
 * @description
 * Provide div for the Logger Services .
 * # Require
 * [url=#/module=ovhServices&service=Logger]`Logger`[/url] service on controller view.
 * As attribute:
 *<code:html>
 *<div data-logger data-logger-prefix="~$" style="height:75px;overflow:auto;" class="span7 alert" />
 *</code>
 * In controller
 * <code:js>
 * var Ctrl = function (Logger) {
 * Loggger.log('info', 'info log');
 * Loggger.log('warning', 'warn log');
 * Loggger.log('error', 'error log');
 * Loggger.log('success', 'success log');
 * };
 * Ctrl.$inject = ['Logger'];
 * </code>
 * Result :
 * <code:html>
 * <div data-logger-prefix="&gt;" data-logger="" style="height:75px;overflow:auto;" class="span7 alert ng-isolate-scope ng-scope">
 * <!-- ngRepeat: message in messages -->
 * <p class="text-info">~$>info log</p>',
 * <p class="text-warning">~$>warn log</p>',
 * <p class="text-error">~$>error log</p>',
 * <p class="text-success">~$>success log</p>',
 * </div>
 * </code>
*/
angular.module('ua.logger').directive('logger', ['Logger', function () {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            prefix: '@loggerPrefix'
        },
        template: '<p data-ng-repeat="message in messages" class="text-{{message.type|lowercase}}">{{prefix}} {{message.message}}</p>',
        link: function (scope) {
            var messages = scope.messages = [];

            scope.$on('loggerLog', function (evt, msg) {
                messages = $.merge(messages, msg);
            });
        }
    };
}]);
