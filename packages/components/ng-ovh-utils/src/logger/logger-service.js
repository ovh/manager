/**
 * @type service
 * @name ovhServices:Logger
 * @see [url=#/module=ovhDirectives&directive=logger]`logger`[/url] service on controller view.
 * @description
 * When you call a Logger function, an event will be broadcast by the rootscope
 * Add `Logger` service into Your controller
 * @example
 * Equivalent level info example
 * <code:js>
 * var Ctrl = function (Logger) {
 * Loggger.log('info', 'info log');
 * Logger.info('info log');
 * Logger.info(['info', 'log']); //two logs
 * Logger.log({
 *  type: 'info',
 *  message: 'info log'
 * });
 * Logger.info(['info', { // two logs
 *    message: 'log'
 * }]);
 *</code>
 * Equivalent level warn example
 * <code:js>
 * Loggger.log('warning', 'warn log');
 * Logger.warning('warn log');
 * Logger.warning(['warn', 'log']); //two logs
 * Logger.log({
 *  type: 'warning',
 *  message: 'warn log'
 * });
 * Logger.warning(['info', { //two logs
 *  message: 'log'
 * }]);
 *</code>
 * Equivalent error example
 * <code:js>
 * Loggger.log('error', 'error log');
 * Logger.error('error log');
 * Logger.error(['error','log']); //two log
 * Logger.log({
 *  type: 'error',
 *  message: 'error log'
 * });
 * Logger.error(['error', { //two log
 *  message: 'log'
 * }]);
 *</code>
 * Level success example
 * <code:js>
 * Loggger.log('success', 'success log');
 * Logger.success('success log');
 * Logger.success(['success', 'log']); //two logs
 * Logger.log({
 *  type: 'success',
 *  message: 'success log'
 * });
 * Logger.success(['success', { //two logs
 *  message: 'log'
 * }]);
 *</code>
 * Multi level log
 * <code:js>
 * // one error, one succes, one info
 * Logger.log([{
 *  type: 'error',
 *  message : 'error log'
 * }, {
 *  type: 'success',
 *  message: 'succes log'
 * }, {
 *  type: 'info'
 *  message: 'message info'
 * }]);
 *</code>
 * Overwriting log level by logged object
 * <code:js>
 * Logger.info({ // log on error
 *  type: 'error'
 *  message: 'error log'
 * });
 * // two succes, one error
 * Logger.success(['it is a success', {
 *  message: 'it is a success too !'
 * }, {
 *  type: 'error',
 *  message: 'damned it is an erro'
 * }]);
 * };
 * Ctrl.$inject = ['Logger'];
 * </code>
 */
angular.module('ua.logger').service('Logger', ['$rootScope', function (rootScope) {
    'use strict';
    var fireLog  = function (messages) {
        rootScope.$broadcast('loggerLog', messages);
    };

    /**
     * @type function
     * @name ovhServices:Logger.log
     * @description
     * fire `loggerLog` event
     * if you log an object, your object must have an 'message' attributs. If the object have `type`, the logger log with it `type`.
     * @param {*|array[string|object|int]} {a} if string, it can be the level log if you have a seconde arguments. Otherwise the thing that you want to log.
     * @param {*} {b} OPTIONAL - the thing that you want to log
     **/
    this.log = function (a, b) {
        var messages = [];

        //We have two arguments
        if (b !== undefined && b !== null) {
            if (angular.isArray(b)) {
                angular.forEach(b, function (item) {
                    if (angular.isString(item)) {
                        messages.push({
                            type: a,
                            message: item
                        });
                    } else if (angular.isObject(item)) {
                        messages.push({
                            type: item.type || a,
                            message: item.message || ''
                        });
                    }
                });
            } else if (angular.isObject(b)) {
                messages.push({
                    type: b.type || a,
                    message: b.message || ''
                });
            } else if (angular.isString(b)) {
                messages.push({
                    type: a,
                    message: b
                });
            } else {
                messages.push({
                    type: 'info',
                    message: b + ''
                });
            }
        } else {
            // We only have one arguments
            if (angular.isArray(a)) {
                angular.forEach(a, function (item) {
                    if (angular.isString(item)) {
                        messages.push({
                            type: 'info',
                            message: item
                        });
                    } else if (angular.isObject(item)) {
                        messages.push({
                            type: item.type || 'info',
                            message: item.message || ''
                        });
                    }
                });
            } else if (angular.isObject(a)) {
                messages.push({
                    type: a.type || 'info',
                    message: a.message || ''
                });
            } else if (angular.isString(a)) {
                messages.push({
                    type: 'info',
                    message: a
                });
            } else {
                messages.push({
                    type: 'info',
                    message: a + ''
                });
            }
        }

        if (messages.length > 0) {
            fireLog(messages);
        }
    };
    /**
     * @type function
     * @name ovhServices:Logger.info
     * @description
     * fire `loggerLog` with info level
     * @param {*} the thing to log
     **/
    this.info = function (messages) {
        this.log('info', messages);
    };
    /**
     * @type function
     * @name ovhServices:Logger.warning
     * @description
     * fire `loggerLog` with warning level
     * @param {*} the thing to log
     **/
    this.warning = function (messages) {
        this.log('warning', messages);
    };
    /**
     * @type function
     * @name ovhServices:Logger.error
     * @description
     * fire `loggerLog` with error level
     * @param {*} the thing to log
     **/
    this.error = function (messages) {
        this.log('error', messages);
    };
    /**
     * @type function
     * @name ovhServices:Logger.success
     * @description
     * fire `loggerLog` with success level
     * @param {*} the thing to log
     **/
    this.success = function (messages) {
        this.log('success', messages);
    };
}]);
